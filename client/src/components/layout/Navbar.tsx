import { NavLink } from "react-router-dom";

export default function Navbar() {
    const linkStyle =
        "px-4 py-2 rounded-xl transition-colors text-sm font-medium";

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

            {/* Logo */}
            <NavLink
            to="/"
            className="text-2xl font-bold text-white tracking-tight"
            >
            ⚗️ Chemora
            </NavLink>

            {/* Links */}
            <div className="flex items-center gap-2">
            <NavLink
                to="/balance"
                className={({ isActive }) =>
                `${linkStyle} ${
                    isActive
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`
                }
            >
                ⚖️ Balance
            </NavLink>

            <NavLink
                to="/molar-mass"
                className={({ isActive }) =>
                `${linkStyle} ${
                    isActive
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`
                }
            >
                🧪 Molar Mass
            </NavLink>
            </div>
        </div>
        </nav>
    );
}