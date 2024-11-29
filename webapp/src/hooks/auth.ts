import Config from "../config.ts"
import {fetcher} from "./shared.ts";
import useSWRMutation from "swr/mutation";
import {useState} from "react";
import useSWR from "swr";

export interface LoginArgs {
    email: string;
    password: string;
}

export interface LoginReturn {
    user_name: string;
    access_token: string;
}

export interface AuthHookReturn {
    token?: string;
    error?: Error;
    login: (args: LoginArgs) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    profile?: UserProfile
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
}

// Hooks

export const useAuth = (): AuthHookReturn => {
    const [token, setToken] = useState<string | undefined>(window.localStorage.getItem("access_token") ?? undefined);

    const {
        error,
        trigger,
        isMutating,
    } = useSWRMutation<LoginReturn, Error, string, LoginArgs>(`${Config.API_ENDPOINT}/auth`, (url, { arg }) => fetcher(url, {
        method: "POST",
        payload: arg
    }));

    const profileKey: [string, string] | undefined = token ? [`${Config.API_ENDPOINT}/users/me`, token] : undefined;

    const {
        data: profile,
        isLoading,
    } = useSWR<UserProfile, Error, [string, string] | undefined>(profileKey, ([url, jwt]) => fetcher(url, { jwt }))

    const login = async (args: LoginArgs) => {
        const { access_token } = await trigger(args);
        setToken(access_token);
        window.localStorage.setItem("access_token", access_token);
    }

    const logout = () => {
        window.localStorage.removeItem("access_token");
        setToken(undefined);
    }

    return { token, profile, error, login, logout, isLoading: isLoading || isMutating }
}