import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {ArrowRightEndOnRectangleIcon, UserIcon} from "@heroicons/react/24/outline";
import {cloneElement, ReactElement, useContext} from "react";
import {useNavigate} from "react-router-dom";
import Config from "../../config.ts";
import AuthContext from "../../context/auth-context.ts";

interface ProfileDropdownItemProps {
    label: string;
    icon: ReactElement
    onClick?: () => void;
}

const ProfileDropdownItem = (props: ProfileDropdownItemProps): ReactElement => {
    return (
        <a
            href="#"
            onClick={props.onClick}
            className="font-bold text-gray-700 hover:text-indigo-700 px-4 py-4 flex items-center space-x-3"
        >
            {cloneElement(props.icon, { className: "text-current w-5 h-5 transition-all duration-200 ease-out" })}
            <span>{props.label}</span>
        </a>
    )
}

const ProfileDropdown = (): ReactElement  => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogoutClick = () => {
        logout();
        navigate(Config.LINKS.LOGIN);
    }

    return (
        <Popover className="relative">
            <PopoverButton
                className="w-12 h-12 rounded-full justify-center p-0"
                aria-label="Profile Dropdown"
            >
                <UserIcon className="w-5 h-5" />
            </PopoverButton>
            <PopoverPanel
                transition
                anchor="bottom end"
                className="bg-gray-50 rounded-md block mt-4 transition duration-200 ease-out
                    data-[closed]:translate-y-12 data-[closed]:opacity-0 min-w-[200px] divide-y divide-gray-200 shadow-2xl"
            >
                <ProfileDropdownItem
                    label="Logout"
                    icon={<ArrowRightEndOnRectangleIcon />}
                    onClick={onLogoutClick}
                />
            </PopoverPanel>
        </Popover>
    )
}

export default ProfileDropdown;