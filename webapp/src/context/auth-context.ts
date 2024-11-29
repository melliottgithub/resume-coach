import {createContext} from "react";
import {AuthHookReturn} from "../hooks/auth.ts";

const AuthContext = createContext<AuthHookReturn>({
    token: undefined,
    isLoading: false,
    logout: () => {},
    login: async () => {},
    profile: {
        id: "",
        name: "",
        email: ""
    }
});

export default AuthContext;