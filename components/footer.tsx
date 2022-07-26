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

import Image from "next/image";

export default function Footer() {
    return (
        <footer className="flex items-center justify-center w-full h-24 border-t">
            <a
                className="flex items-center justify-center"
                href="https://vercel.com?utm_source=korandoru&utm_campaign=oss"
                target="_blank"
                rel="noopener noreferrer"
            >
                Powered by{' '}
                <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
            </a>
        </footer>
    );
}