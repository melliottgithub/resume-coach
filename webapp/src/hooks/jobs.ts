import useSWR from "swr";
import Config from "../config.ts";
import {BaseEntity, ClientResponse, fetcher, PaginatedResponse} from "./shared.ts";
import useSWRInfinite from "swr/infinite";

export interface Job extends BaseEntity {
    company: string;
    content?: string;
    job_title: string;
    token_count_llama: number;
    address: {
        country: string;
        city: string;
        state: string;
        location: string;
    },
    last_updated: string;
    apply_url: string;
    source_id: string;
}

export const useJobs = () => {
    const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Job>) => {
        if (pageIndex === 0) return `${Config.API_ENDPOINT}/jobs?limit=10`;
        if (!previousPageData.last_key_value || previousPageData.items.length === 0) return null;
        return `${Config.API_ENDPOINT}/jobs?limit=10&last_key_value=${encodeURIComponent(previousPageData.last_key_value)}`;
    }

    const {
        data,
        error,
        isLoading,
        size,
        setSize
    } = useSWRInfinite<PaginatedResponse<Job>>(getKey, fetcher, { keepPreviousData: true });

    const flatData = data?.reduce<Job[]>((accum, current) => {
        return [...accum, ...current.items];
    }, [])

    return { data: flatData, error, isLoading, size, setSize }
}

export const useJob = (jobId?: string): ClientResponse<Job> => {
    const {
        data: jobData,
        error: jobError,
        isLoading: jobIsLoading
    } = useSWR<Job>(jobId ? `${Config.API_ENDPOINT}/jobs/${jobId}` : null, fetcher, {
        keepPreviousData: true
    });

    const {
        data: contentData,
        error: contentError,
        isLoading: contentIsLoading
    } = useSWR<string>(jobId ? `${Config.API_ENDPOINT}/jobs/${jobId}/description` : null, (url) => fetcher(url, {
        text: true
    }), {
        keepPreviousData: true
    })

    const data = jobData ? { ...jobData, content: contentData } : undefined;

    return {
        data,
        error: jobError || contentError,
        isLoading: contentIsLoading || jobIsLoading
    }
}