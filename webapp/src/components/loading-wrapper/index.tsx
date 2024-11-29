import {ReactElement, ReactNode} from "react";
import Loading from "../../assets/images/loading.svg?react";

interface LoadingWrapperProps {
    isLoading: boolean
    children?: ReactNode
}

const LoadingWrapper = (props: LoadingWrapperProps): ReactElement => {
    return (
        <div className="relative">
            <div
                className={"transition-opacity duration-200 inset-0 flex absolute items-center justify-center " +
                    `${props.isLoading ? "opacity-100" : "opacity-0 select-none pointer-events-none"}`}
            >
                <Loading className="w-10 h-10 fill-indigo-500 animate-spin" />
            </div>
            <div
                className={"transition-opacity duration-200 " +
                    `${props.isLoading ? "opacity-20 select-none pointer-events-none" : "opacity-100"}`}
            >
                {props.children}
            </div>
        </div>
    )
}

export default LoadingWrapper;