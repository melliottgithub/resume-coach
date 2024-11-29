const Config = {
    API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
    LINKS: {
        HOME: "/",
        APPLICATIONS_LISTING: "/applications",
        APPLICATION: (id: string): string => `/applications/${id}`,
        LOGIN: "/login",
        REGISTER: "/register"
    }
}

export default Config;