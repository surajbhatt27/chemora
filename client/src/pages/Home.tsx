import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">⚗️ Chemora</h1>

        <p className="text-zinc-400 mb-8">
            Smart chemistry tools powered by real chemistry logic.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
            
            <Link
            to="/balance"
            className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500 transition"
            >
            <h2 className="text-xl font-semibold mb-2">
                ⚖️ Reaction Balancer
            </h2>

            <p className="text-zinc-400 text-sm">
                Balance chemical equations instantly using matrix solving.
            </p>
            </Link>

            <Link
            to="/molar-mass"
            className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500 transition"
            >
            <h2 className="text-xl font-semibold mb-2">
                🧪 Molar Mass Calculator
            </h2>

            <p className="text-zinc-400 text-sm">
                Calculate molar masses with advanced formula parsing.
            </p>
            </Link>

        </div>
        </div>
    );
}