import { NavLink, useLocation } from "react-router-dom";
import { getCookie } from "../utils";

function SidebarLeft(){
    const tabs = [
        { name: "Home", path: "/home" },
        { name: "Create", path: "/create" },
        { name: "Profile", path: "/profile" },
    ];

    const baseClass ="block w-full rounded-lg px-4 py-2 text-left transition duration-200 no-underline";
    const activeClass = "bg-gray-100 font-semibold";
    const normalClass = "hover:bg-gray-50";

    const onLogout = async () => {
            const csrfToken = getCookie("csrftoken");
            await fetch("http://localhost:8000/users/logout/", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
            });
            alert("Logged out!");
            window.location.href = "/";
        };

    return(
        <aside className="w-1/5 flex flex-col justify-between p-2 bg-white shadow-[3px_0_6px_rgba(0,0,0,0.1)] h-screen">
            <div>
                <h1 className="font-bold mb-8 px-4 p-4 text-3xl">Emosion</h1>
                <nav className="space-y-2">
                    {tabs.map((tab)=>(
                        <NavLink
                            key={tab.name}
                            to={tab.path}
                            className={({ isActive }) =>
                                `${baseClass} ${isActive ? activeClass : normalClass}`
                            }
                            >
                            {tab.name}
                            </NavLink>
                    ))}
                </nav>
            </div>
            <div className="pt-4">
                <button onClick={onLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:text-red-700 rounded transition"
                >
                Logout
                </button>
            </div>
        </aside>
    );
}
export default SidebarLeft;