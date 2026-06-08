import { NavLink } from "react-router-dom";
import { Hexagon } from "lucide-react";

export default function Navbar() {
    const linkStyle = "px-3 py-1.5 rounded-md text-sm font-medium transition-colors";

    return (
        <nav className="border-b border-gray-800 bg-black">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Logo with Hexagon icon */}
                <NavLink
                    to="/"
                    className="flex items-center gap-2 text-xl font-semibold text-white tracking-tight hover:text-gray-200 transition-colors"
                >
                    <Hexagon className="w-5 h-5" />
                    <span>Chemora</span>
                </NavLink>

                {/* Navigation Links */}
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/balance"
                        className={({ isActive }) =>
                            `${linkStyle} ${
                                isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`
                        }
                    >
                        Balancer
                    </NavLink>

                    <NavLink
                        to="/molar-mass"
                        className={({ isActive }) =>
                            `${linkStyle} ${
                                isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`
                        }
                    >
                        Molar Mass
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}