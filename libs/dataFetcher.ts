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

export async function fetchAffinityRatio() {
    const queryParams = new URLSearchParams({
        "user": "explorer",
        "default_format": "JSON",
    });
    const response = await fetch(`https://play.clickhouse.com?${queryParams}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: `
        SELECT
            repo_name,
            uniq(actor_login) AS total_stars,
            uniqIf(actor_login, actor_login IN
            (
                SELECT actor_login
                FROM github_events
                WHERE (event_type = 'WatchEvent') AND (startsWith(repo_name, 'apache/pulsar'))
            )) AS our_stars,
            round(our_stars / total_stars, 2) AS ratio
        FROM github_events
        WHERE (event_type = 'WatchEvent') AND (NOT startsWith(repo_name, 'apache/pulsar'))
        GROUP BY repo_name
        HAVING total_stars >= 100
        ORDER BY ratio DESC
        LIMIT 50
        `
    });
    return await response.json();
}
