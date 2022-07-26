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

import {fetchAffinityRatio} from "../../libs/dataFetcher";
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import {StarAffinityRatio} from "../../interfaces";
import Footer from "../../components/footer";

interface Props {
    data: StarAffinityRatio[]
}

export default function AffinityRatio({data}: Props) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Neptune Dashboard</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Repository Affinity Ratio
                </h1>

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
                </table>

            </main>

            <Footer/>
        </div>
    )
}

export async function getServerSideProps() {
    const result = await fetchAffinityRatio();
    const data = result.data.map((record: any) => {
        return {
            repoName: record.repo_name,
            totalStars: record.total_stars,
            ourStars: record.our_stars,
            ratio: record.ratio,
        }
    });
    return {props: {data}}
}