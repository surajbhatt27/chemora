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
            setResult(formatEquation(eq, coeffs));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
                <h1 className="text-xl font-semibold text-white mb-1">
                    Reaction Balancer
                </h1>
                <p className="text-gray-400 text-sm mb-5">
                    Enter an unbalanced chemical equation.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        placeholder="e.g., H2 + O2 -> H2O"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
                    />
                    <button
                        onClick={handleBalance}
                        className="px-4 py-2 rounded-md bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                        Balance
                    </button>
                </div>

                {error && (
                    <div className="mt-4 px-3 py-2 rounded-md bg-red-950/50 border border-red-800 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Balanced Equation
                        </p>
                        <p className="text-gray-200 font-mono text-sm sm:text-base break-all">
                            {result}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}