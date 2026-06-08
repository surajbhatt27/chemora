import { Link } from "react-router-dom";
import { Hexagon, Scale, FlaskConical, Grid3x3 } from "lucide-react";

export default function Home() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                    <Hexagon className="w-12 h-12 text-gray-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Chemora</h1>
                <p className="text-gray-400 text-lg">Chemistry tools that actually work.</p>
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
            </div>
        </div>
    );
}