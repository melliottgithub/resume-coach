import {ReactElement} from "react";
import {NavLink} from "react-router-dom";
import Config from "../../config.ts";
import {ClipboardDocumentCheckIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";

const Navigation = (): ReactElement => {

    const getClassName = (active: boolean): string => {
        const baseClassName = "px-5 py-2.5 rounded-2xl appearance-none font-bold text-base transition-all flex items-center space-x-2 border";
        const className = active ? "bg-indigo-700 hover:bg-indigo-500 text-white border-indigo-700"
            : "bg-transparent text-gray-400 hover:bg-slate-800 hover:text-white border-slate-800";
        return `${baseClassName} ${className}`
    }

    return (
        <nav className="space-x-4 flex items-center">
            <NavLink
                to={Config.LINKS.HOME}
                className={({ isActive }) => getClassName(isActive)}
            >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span className="text-current">Search Jobs</span>
            </NavLink>
            <NavLink
                to={Config.LINKS.APPLICATIONS_LISTING}
                className={({ isActive }) => getClassName(isActive)}
            >
                <ClipboardDocumentCheckIcon className="w-5 h-5" />
                <span className="text-current">Applications</span>
            </NavLink>
        </nav>
    )
}

export default Navigation;