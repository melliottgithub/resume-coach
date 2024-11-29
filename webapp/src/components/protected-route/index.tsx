import {ReactElement, ReactNode, useContext} from "react";
import { Navigate } from "react-router";
import Config from "../../config.ts";
import AuthContext from "../../context/auth-context.ts";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = (props: ProtectedRouteProps): ReactElement => {
    const { token } = useContext(AuthContext);

    if (token) return <>{props.children}</>;
    else return <Navigate to={Config.LINKS.LOGIN} />
}

export default ProtectedRoute;