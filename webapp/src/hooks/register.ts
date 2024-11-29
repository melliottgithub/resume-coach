import {fetcher} from "./shared.ts";
import useSWRMutation from "swr/mutation";
import Config from "../config.ts";
import {UserProfile} from "./auth.ts";

interface RegisterArgs {
    email: string;
    password: string;
    name: string;
}

// Hooks

export const useRegister = () => {
    const {
        data,
        error,
        trigger: register,
        isMutating: isLoading
    } = useSWRMutation<UserProfile, Error, string, RegisterArgs>(`${Config.API_ENDPOINT}/users`, (url, { arg }) => fetcher(url, {
        method: "POST",
        payload: arg
    }))

    return { data, error, register, isLoading }
}