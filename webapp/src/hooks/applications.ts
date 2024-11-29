import useSWRMutation from "swr/mutation";
import {BaseEntity, fetcher} from "./shared.ts";
import Config from "../config.ts";
import useSWR from "swr";
import {useContext} from "react";
import AuthContext from "../context/auth-context.ts";

export interface Application extends BaseEntity {
    title: string;
    status: string;
    created_at: string;
    job_id: string;
    user_id: string;
}

export interface ApplicationReport extends BaseEntity {
    content: string;
    document_type: string;
}

export interface ApplicationDetails {
    coaching_report: ApplicationReport | null;
    job_application: Application;
}

interface CreateApplicationArgs {
    job_id: string;
    resume_text?: string;
    resume_file_base64?: string;
}

interface GetApplicationsArgs {
    limit?: number;
}

interface ChatArgs {
    message: string;
}

export interface ChatMessage {
    messageType: "human" | "ai";
    content: string;
}

// Utils

const transformChatResponse = async (output: string): Promise<ChatMessage[]> => {
    return await JSON.parse(await JSON.parse(output)) as ChatMessage[];
}

// Hooks

export const useCreateApplication = () => {
    const { token } = useContext(AuthContext);
    const url = `${Config.API_ENDPOINT}/applications`;

    const {
        data,
        error,
        trigger,
        isMutating
    } = useSWRMutation<Application, Error, [string, string] | null, CreateApplicationArgs>(token ? [url, token] : null, async ([url, token], { arg }) => {
        const creationResponse = await fetcher(url, { jwt: token, payload: arg, method: "POST" }) as Application;
        const analysisUrl = `${url}/${creationResponse.id}/analyze`;
        await fetcher(analysisUrl, { jwt: token, text: true, method: "POST" });
        return creationResponse;
    });

    return { trigger, data, error, isMutating };
}

export const useGetApplications = (arg?: GetApplicationsArgs) => {
    const { token } = useContext(AuthContext);
    const url = `${Config.API_ENDPOINT}/applications?limit=${arg?.limit ?? 10}`;

    const {
        data,
        error,
        isLoading
    } = useSWR<Application[], Error, [string, string] | null>(token ? [url, token] : null, ([url, token]) => fetcher(url, { jwt: token }));
    return { data, error, isLoading };
}

export const useGetApplication = (applicationId?: string) => {
    const { token } = useContext(AuthContext);
    const url = applicationId && token ? `${Config.API_ENDPOINT}/applications/${applicationId}` : null;

    const {
        data,
        error,
        isLoading
    } = useSWR<ApplicationDetails, Error, [string, string] | null>(token && url ? [url, token] : null, ([url, token]) => fetcher(url, { jwt: token }))

    return { data, error, isLoading }
}

export const useChat = (applicationId?: string) => {
    const { token } = useContext(AuthContext);
    const url = applicationId ? `${Config.API_ENDPOINT}/applications/${applicationId}/chat` : null;

    const {
        error: sendMessageError,
        isMutating,
        trigger: sendMessage
    } = useSWRMutation<ChatMessage[], Error, [string, string] | null, ChatArgs>(token && url ? [url, token] : null, async ([url, token], { arg }) => {
        const response = await fetcher(url, {
            jwt: token,
            method: "POST",
            payload: arg,
            text: true
        })
        return await transformChatResponse(response);
    })

    const {
        error: getMessagesError,
        isLoading,
        data
    } = useSWR<ChatMessage[], Error, [string, string] | null>(token && url ? [url, token] : null, async ([url, token]) => {
        const response = await fetcher(url, {
            jwt: token,
            text: true,
            method: "GET"
        });
        return await transformChatResponse(response);
    })

    return {
        data,
        error: sendMessageError || getMessagesError,
        loading: isLoading || isMutating,
        sendMessage
    };
}