import Config from "./config.ts";
import {ReactElement, StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

// Routes
import JobsPage from "./routes/jobs-page.tsx";
import MainPage from "./routes/main-page.tsx";
import ApplicationPage from "./routes/applications-page.tsx";
import LoginPage from "./routes/login-page.tsx";
import RegisterPage from "./routes/register-page.tsx";
import ProtectedRoute from "./components/protected-route";

// Styling
import "./assets/styles/styles.css";

// Time Library
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AuthContext from "./context/auth-context.ts";
import {useAuth} from "./hooks/auth.ts";
import ApplicationDetailsPage from "./routes/application-details-page.tsx";

dayjs.extend(relativeTime);

const router = createBrowserRouter([
    {
        path: Config.LINKS.HOME,
        element: <ProtectedRoute><MainPage /></ProtectedRoute>,
        children: [
            {
                index: true,
                element: <ProtectedRoute><JobsPage /></ProtectedRoute>
            },
            {
                path: Config.LINKS.APPLICATIONS_LISTING,
                element: <ProtectedRoute><ApplicationPage /></ProtectedRoute>
            },
            {
                path: Config.LINKS.APPLICATION(":applicationId"),
                element: <ProtectedRoute><ApplicationDetailsPage /></ProtectedRoute>
            }
        ]
    },
    {
        path: Config.LINKS.LOGIN,
        element: <LoginPage />
    },
    {
        path: Config.LINKS.REGISTER,
        element: <RegisterPage />
    }
]);

const Main = (): ReactElement => {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            <RouterProvider router={router} />
        </AuthContext.Provider>
    )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Main />
  </StrictMode>,
)
