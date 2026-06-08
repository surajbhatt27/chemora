import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Hexagon, Menu, X, Scale, FlaskConical, Grid3x3, Repeat } from "lucide-react";


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const linkStyle = "px-3 py-1.5 rounded-md text-sm font-medium transition-colors";
    const mobileLinkStyle = "flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition-colors";

    return (
        <nav className="border-b border-gray-800 bg-black sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="flex items-center gap-2 text-xl font-semibold text-white tracking-tight hover:text-gray-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <Hexagon className="w-5 h-5" />
                    <span>Chemora</span>
                </NavLink>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center gap-1">
                    <NavLink
                        to="/balance"
                        className={({ isActive }) =>
                            `${linkStyle} ${isActive
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
                            `${linkStyle} ${isActive
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`
                        }
                    >
                        Molar Mass
                    </NavLink>

                    <NavLink
                        to="/periodic-table"
                        className={({ isActive }) =>
                            `${linkStyle} ${isActive
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`
                        }
                    >
                        Periodic Table
                    </NavLink>

                    <NavLink
                        to="/unit-converter"
                        className={({ isActive }) =>
                            `${linkStyle} ${isActive
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`
                        }
                    >
                        Converter
                    </NavLink>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="sm:hidden p-2 rounded-md hover:bg-gray-900 transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="w-5 h-5 text-white" />
                    ) : (
                        <Menu className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="sm:hidden border-t border-gray-800 bg-black py-2 px-4">
                    <div className="flex flex-col gap-1">
                        <NavLink
                            to="/balance"
                            className={({ isActive }) =>
                                `${mobileLinkStyle} ${isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Scale className="w-5 h-5" />
                            Balancer
                        </NavLink>

                        <NavLink
                            to="/molar-mass"
                            className={({ isActive }) =>
                                `${mobileLinkStyle} ${isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FlaskConical className="w-5 h-5" />
                            Molar Mass
                        </NavLink>

                        <NavLink
                            to="/periodic-table"
                            className={({ isActive }) =>
                                `${mobileLinkStyle} ${isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Grid3x3 className="w-5 h-5" />
                            Periodic Table
                        </NavLink>

                        <NavLink
                            to="/unit-converter"
                            className={({ isActive }) =>
                                `${mobileLinkStyle} ${isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Repeat className="w-5 h-5" />
                            Converter
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
}