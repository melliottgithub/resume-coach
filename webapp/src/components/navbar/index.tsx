import Logo from "../../assets/images/logo.svg";
import ProfileDropdown from "../profile-dropdown";
import {ReactElement, useContext} from "react";
import Config from "../../config.ts";
import {NavLink} from "react-router-dom";
import AuthContext from "../../context/auth-context.ts";

const Navbar = (): ReactElement => {
    const { profile } = useContext(AuthContext);

    return (
        <nav className="w-full container mx-auto px-6 py-8 bg-transparent flex items-center justify-between">
            <NavLink
               to={Config.LINKS.HOME}
               className="text-white text-2xl mr-4 hover:text-indigo-500 space-x-4 flex items-center"
            >
                <img className="w-10 h-10" src={Logo} alt="Logo" />
                <span className="font-bold">Resume Coach</span>
            </NavLink>
            <div className="flex items-center space-x-4">
                <p className="font-medium text-gray-300 text-lg">Welcome, {profile?.name}!</p>
                <ProfileDropdown />
            </div>
        </nav>
    )
}

export default Navbar;