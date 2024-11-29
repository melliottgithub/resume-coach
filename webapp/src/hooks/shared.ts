export interface BaseEntity {
    id: string;
}

export interface ClientResponse<T> {
    data?: T;
    error?: string;
    isLoading: boolean;
}

export interface ClientError {
    detail: string;
}

export interface MutationArg<T> {
    arg: T
}

export interface PaginatedResponse<T> {
    items: T[];
    limit: number;
    last_key_value: null | string;
}

export interface FetcherParams {
    method?: string;
    payload?: object;
    jwt?: string;
    text?: boolean;
}

export const fetcher = async (url: string, fetcherParams?: FetcherParams) => {
    const response = await fetch(url, {
        method: fetcherParams?.method ?? "GET",
        body: (fetcherParams && fetcherParams.payload) ? JSON.stringify(fetcherParams.payload) : undefined,
        headers: {
            "Content-Type": "application/json",
            "Authorization": fetcherParams?.jwt ? `Bearer ${fetcherParams.jwt}` : ""
        }
    });

    if (!response.ok) {
        const errorResponse = await response.json() as ClientError;

        // Check if JWT is expired.
        if (response.status === 401) {
            window.localStorage.removeItem("access_token");
            window.location.pathname = "/login";
        }

        throw new Error(errorResponse.detail)
    }

    if (fetcherParams?.text) return await response.text();
    else return await response.json();
}