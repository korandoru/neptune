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

import type {NextApiRequest, NextApiResponse} from 'next'
import axios from "axios";

type StarAffinityRatio = {
    repoName: string
    totalStars: number,
    ourStars: number,
    ratio: number,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StarAffinityRatio[]>
) {
    let paramOrigins = req.body.origins.map((origin: string) => `'${origin}'`);
    paramOrigins = paramOrigins.join(',');
    paramOrigins = `[${paramOrigins}]`;

    let result = await axios.get('https://play.clickhouse.com', {
        params: {
            "user": "explorer",
            "default_format": "JSON",
            "param_origins": paramOrigins,
        },
        data: `
            SELECT
                repo_name,
                uniq(actor_login) AS total_stars,
                uniqIf(actor_login, actor_login IN
                (
                    SELECT actor_login
                    FROM github_events
                    WHERE (event_type = 'WatchEvent') AND (repo_name IN ({origins:Array(String)}))
                )) AS our_stars,
                round(our_stars / total_stars, 2) AS ratio
            FROM github_events
            WHERE (event_type = 'WatchEvent') AND (repo_name NOT IN ({origins:Array(String)}))
            GROUP BY repo_name
            HAVING total_stars >= 100
            ORDER BY ratio DESC
            LIMIT 50
        `
    });

    res.status(200).json(result.data.data.map((record: any) => {
        return {
            repoName: record.repo_name,
            totalStars: record.total_stars,
            ourStars: record.our_stars,
            ratio: record.ratio,
        }
    }));
}
