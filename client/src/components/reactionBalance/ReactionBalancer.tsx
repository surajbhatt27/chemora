import { useState } from "react";
import { parseEquation } from "../../utils/parseEquation";
import { getAllElements } from "../../utils/getElement";
import { buildEquations } from "../../utils/buildEquations";
import { solveMatrix } from "../../utils/solveMatrix";
import { formatEquation } from "../../utils/formatEquation";

export default function ReactionBalancer() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const handleBalance = () => {
    setError("");
    setResult("");

    try {
        const eq = parseEquation(input);
        const elements = getAllElements(eq);
        const matrix = buildEquations(eq, elements);

        const coeffs = solveMatrix(matrix);

        console.log("Coefficients:", coeffs);

        setResult(formatEquation(eq, coeffs));
    } catch (err: any) {
        setError(err.message);
    }
    };

    return (
        <div className="bg-zinc-800/60 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-zinc-700">
            <h1 className="text-xl font-semibold text-white mb-1"> Reaction Balancer</h1>
            <p className="text-zinc-400 text-sm mb-4">
                Enter a chemical equation and let Chemora balance it.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    placeholder="e.g. H2 + O2 -> H2O"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleBalance}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium text-white"
                >
                    Balance
                </button>
            </div>

            {error && (
                <div className="mb-3 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-zinc-700">
                    <p className="text-zinc-400 text-xs mb-1">Balanced Equation</p>
                    <p className="text-indigo-400 font-medium">{result}</p>
                </div>
            )}
        </div>
    );
}