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
        <div className="flex flex-col gap-2 mb-4 w-full">
        <input
            type="text"
            value={formula}
            onChange={(e) => onFormulaChange(e.target.value)}
            placeholder="Enter formula (e.g. H2O, NaCl, Ca(OH)2)"
            className="
            w-full px-4 py-3 rounded-xl
            bg-zinc-900 border border-zinc-700
            text-white placeholder:text-zinc-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-all duration-200
            "
        />
        {formula && interpretations.length > 0 && (
            <p className="text-xs text-zinc-500 ml-1">
            {interpretations.length} possible interpretation
            {interpretations.length !== 1 && "s"}
            </p>
        )}
        {suggestions.length > 0 && (
            <div className="mt-2">
            <p className="text-xs font-medium text-zinc-400 mb-2">
                Suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                <button
                    key={i}
                    onClick={() => onSelectSuggestion(s.originalIndex)}
                    className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${
                        selectedIndex === s.originalIndex
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                    }
                    `}
                >
                    {s.label}
                </button>
                ))}
            </div>
            </div>
        )}
        <p className="text-xs text-zinc-500"> Try: H2O, CO2, Fe2O3, Ca(OH)2</p>
        </div>
    );
}