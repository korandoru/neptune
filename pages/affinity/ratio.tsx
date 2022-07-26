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

import Head from 'next/head'
import {StarAffinityRatio} from "../../interfaces";
import Footer from "../../components/footer";
import useSWR from 'swr'
import {fetcher} from "../../libs/fetcher";

export default function AffinityRatio() {
    const {data} = useSWR<StarAffinityRatio[]>('/api/affinity/ratio', fetcher);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>Neptune Dashboard</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <h1 className="text-6xl font-bold">
                    Repository Affinity Ratio
                </h1>

                {data ? (
                        <table>
                            <thead>
                            <tr>
                                <th>RepoName</th>
                                <th>TotalStars</th>
                                <th>OurStars</th>
                                <th>Ratio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((record) => (
                                <tr key={record.repoName}>
                                    <td>{record.repoName}</td>
                                    <td>{record.totalStars}</td>
                                    <td>{record.ourStars}</td>
                                    <td>{record.ratio}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>)
                    : (
                        <button type="button"
                                className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
                                disabled>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                        </button>
                    )
                }
            </main>

            <Footer/>
        </div>
    )
}
