const Config = {
    API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
    LINKS: {
        HOME: "/",
        APPLICATIONS_LISTING: "/api/applications",
        APPLICATION: (id: string): string => `/api/applications/${id}`,
        LOGIN: "/api/login",
        REGISTER: "/api/register"
    }
}

export default Config;