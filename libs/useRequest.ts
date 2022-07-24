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

import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export type GetRequest = AxiosRequestConfig | null

interface Return<Data, Error>
    extends Pick<
        SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
        'isValidating' | 'error' | 'mutate'
        > {
    data: Data | undefined
    response: AxiosResponse<Data> | undefined
}

export interface Config<Data = unknown, Error = unknown>
    extends Omit<
        SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
        'fallbackData'
        > {
    fallbackData?: Data
}

export default function useRequest<Data = unknown, Error = unknown>(
    request: GetRequest,
    { fallbackData, ...config }: Config<Data, Error> = {}
): Return<Data, Error> {
    const {
        data: response,
        error,
        isValidating,
        mutate
    } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
        request && JSON.stringify(request),
        () => {
            console.log("useRequest: " + request!);
            return axios.request<Data>(request!);
        },
        {
            ...config,
            fallbackData: fallbackData && {
                status: 200,
                statusText: 'InitialData',
                config: request!,
                headers: {},
                data: fallbackData
            }
        }
    )

    return {
        data: response && response.data,
        response,
        error,
        isValidating,
        mutate
    }
}