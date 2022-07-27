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

import {NextApiRequest, NextApiResponse} from "next";
import octokit from "../../../libs/octokit";
import {RequestedReviewerData} from "../../../interfaces";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const prs = await octokit.paginate(octokit.rest.pulls.list, {
        owner: "apache",
        repo: "pulsar",
        state: "open",
        per_page: 100,
    });

    const result: RequestedReviewerData[] = [];
    for (const {html_url, requested_reviewers, base} of prs) {
        if (base.ref != "master") continue;
        if (!requested_reviewers) continue;
        if (requested_reviewers.length <= 0) continue;

        for (const reviewer of requested_reviewers) {
            result.push({
                pr: html_url,
                reviewer: reviewer.login,
            });
        }
    }

    res.status(200).json(result);
}
