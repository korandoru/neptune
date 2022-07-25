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
import {StarAffinityRatio} from "../../../interfaces";
import { getData } from '../../../libs/useRequest';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StarAffinityRatio[]>
) {

    let paramOrigins = req.body.origins.map((origin: string) => `'${origin}'`);
    paramOrigins = paramOrigins.join(',');
    paramOrigins = `[${paramOrigins}]`;

    const result = await getData(paramOrigins);

    res.status(200).json(result.data.map((record: any) => {
        return {
            repoName: record.repo_name,
            totalStars: record.total_stars,
            ourStars: record.our_stars,
            ratio: record.ratio,
        }
    }));
}
