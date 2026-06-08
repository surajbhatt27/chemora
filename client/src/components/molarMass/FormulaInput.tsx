type Interpretation = {
    tokens: { el: string; count: number }[];
    rows: { element: string; quantity: number }[];
    label: string;
    originalIndex: number;
};

interface FormulaInputProps {
    formula: string;
    selectedIndex: number;
    interpretations: Interpretation[];
    suggestions: Interpretation[];
    onFormulaChange: (value: string) => void;
    onSelectSuggestion: (index: number) => void;
}

export default function FormulaInput({
    formula,
    onFormulaChange,
    onSelectSuggestion,
    interpretations,
    suggestions,
    selectedIndex,
}: FormulaInputProps) {
    return (
        <div>
            <input
                type="text"
                value={formula}
                onChange={(e) => onFormulaChange(e.target.value)}
                placeholder="e.g., H2O, NaCl, Ca(OH)2"
                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
            />

            {formula && interpretations.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                    {interpretations.length} interpretation{interpretations.length !== 1 && "s"}
                </p>
            )}

            {suggestions.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                        Alternative interpretations:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => onSelectSuggestion(s.originalIndex)}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                    selectedIndex === s.originalIndex
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-600 mt-3">
                Examples: H2O, CO2, Fe2O3, Ca(OH)2
            </p>
        </div>
    );
}