/*
 * Copyright 2022 Korandoru Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.korandoru.neptune.backend.query;

import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AffinityRatioQuery {

    private final NamedParameterJdbcTemplate jdbc;

    @Autowired
    public AffinityRatioQuery(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public AffinityRatioResult doQuery(List<String> origins) {
        log.debug("AffinityRatioQuery.doQuery with origins: {}", origins);

        final var parameters = new MapSqlParameterSource();
        parameters.addValue("origins", origins);

        final var result = this.jdbc.queryForList("""
                SELECT
                    repo_name,
                    uniq(actor_login) AS total_stars,
                    uniqIf(actor_login, actor_login IN
                    (
                        SELECT actor_login
                        FROM github_events
                        WHERE (event_type = 'WatchEvent') AND (repo_name IN (:origins))
                    )) AS our_stars,
                    round(our_stars / total_stars, 2) AS ratio
                FROM github_events
                WHERE (event_type = 'WatchEvent') AND (repo_name NOT IN (:origins))
                GROUP BY repo_name
                HAVING total_stars >= 100
                ORDER BY ratio DESC
                LIMIT 50
            """, parameters);

        final var crosses = new ArrayList<AffinityRatioResult.Item>();
        for (var item : result) {
            crosses.add(new AffinityRatioResult.Item(
                (String) item.get("repo_name"),
                (long) item.get("total_stars"),
                (long) item.get("our_stars"),
                (double) item.get("ratio")
            ));
        }
        return new AffinityRatioResult(origins, crosses);
    }

}
