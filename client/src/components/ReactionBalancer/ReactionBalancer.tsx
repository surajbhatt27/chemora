import { useState } from "react";

export default function ReactionBalancer() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const handleBalance = () => {
        setError("");
        setResult("");

        if (!input.trim()) {
        setError("Enter a chemical equation bro 😑");
        return;
        }

        // Placeholder logic (you'll replace this later)
        setTimeout(() => {
        setResult("Balanced equation will appear here...");
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-900 to-black text-white p-4">
        <div className="w-full max-w-2xl bg-zinc-800/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-zinc-700">
            
            {/* Title */}
            <h1 className="text-2xl font-bold mb-2">⚗️ Reaction Balancer</h1>
            <p className="text-zinc-400 mb-6">
            Enter a chemical equation and let Chemora do the magic.
            </p>

            {/* Input */}
            <div className="flex gap-2 mb-4">
            <input
                type="text"
                placeholder="e.g. H2 + O2 -> H2O"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
                onClick={handleBalance}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-medium"
            >
                Balance
            </button>
            </div>

            {/* Error */}
            {error && (
            <div className="mb-4 text-red-400 text-sm">
                ⚠️ {error}
            </div>
            )}

            {/* Result */}
            {result && (
            <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-700">
                <p className="text-zinc-400 text-sm mb-1">Balanced Equation</p>
                <p className="text-lg font-semibold text-green-400">
                {result}
                </p>
            </div>
            )}

        </div>
        </div>
    );
}