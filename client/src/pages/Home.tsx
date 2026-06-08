import { Link } from "react-router-dom";
import { Hexagon, Scale, FlaskConical, Grid3x3, Repeat } from "lucide-react";

export default function Home() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                    <Hexagon className="w-12 h-12 text-gray-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Chemora</h1>
                <p className="text-gray-400 text-lg">Chemistry, simplified</p>
            </div>

            {/* Tool Cards */}
            <div className="grid gap-5 sm:grid-cols-2">
                <Link
                    to="/balance"
                    className="block p-6 rounded-lg border border-gray-800 bg-black hover:border-gray-700 hover:bg-gray-900/50 transition-all"
                >
                    <Scale className="w-8 h-8 text-gray-400 mb-3" />
                    <h2 className="text-lg font-semibold text-white mb-1">
                        Reaction Balancer
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Balance chemical equations using matrix solving.
                    </p>
                </Link>

                <Link
                    to="/molar-mass"
                    className="block p-6 rounded-lg border border-gray-800 bg-black hover:border-gray-700 hover:bg-gray-900/50 transition-all"
                >
                    <FlaskConical className="w-8 h-8 text-gray-400 mb-3" />
                    <h2 className="text-lg font-semibold text-white mb-1">
                        Molar Mass Calculator
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Calculate molar masses with advanced formula parsing.
                    </p>
                </Link>

                <Link
                    to="/periodic-table"
                    className="block p-6 rounded-lg border border-gray-800 bg-black hover:border-gray-700 hover:bg-gray-900/50 transition-all"
                >
                    <Grid3x3 className="w-8 h-8 text-gray-400 mb-3" />
                    <h2 className="text-lg font-semibold text-white mb-1">
                        Periodic Table
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Interactive periodic table with element details.
                    </p>
                </Link>

                <Link
                    to="/unit-converter"
                    className="block p-6 rounded-lg border border-gray-800 bg-black hover:border-gray-700 hover:bg-gray-900/50 transition-all"
                >
                    <Repeat className="w-8 h-8 text-gray-400 mb-3" />
                    <h2 className="text-lg font-semibold text-white mb-1">
                        Unit Converter
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Convert moles, grams, liters, temperature, and pressure.
                    </p>
                </Link>
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-gray-800">
                <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Chemora — Chemistry tools for students
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                        Molar mass data based on IUPAC atomic weights
                    </p>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
                    <a
                        href="https://x.com/surj_bhtt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        X
                    </a>
                    <a
                        href="https://linkedin.com/in/surj-bhtt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://instagram.com/surj_bhtt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://github.com/surajbhatt27"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        GitHub
                    </a>
                </div>

                {/* Projects & Portfolio */}
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 pt-4 border-t border-gray-800/50 text-xs">
                    <a
                        href="https://portfolio-eta-three-retunmqhr5.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        Portfolio
                    </a>
                    <span className="text-gray-700 hidden sm:inline">•</span>
                    <a
                        href="https://hireloop-pink.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        PairUp
                    </a>
                    <span className="text-gray-700 hidden sm:inline">•</span>
                    <a
                        href="https://prep-pilot-rho.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        PrepPilot
                    </a>
                </div>
            </footer>
        </div>
    );
}