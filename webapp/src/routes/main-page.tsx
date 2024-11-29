import {ReactElement} from "react";
import {Outlet} from "react-router-dom";
import Navbar from "../components/navbar";

const MainPage = (): ReactElement => {
    return (
        <div className="space-y-6">
            <Navbar/>
            <main className="w-full container mx-auto">
                <Outlet/>
            </main>
        </div>
    )
}

export default MainPage;
