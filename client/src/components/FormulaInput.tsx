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
    playSound: (soundName: 'click' | 'success' | 'pop' | 'error') => void;
}

export default function FormulaInput({formula,onFormulaChange, onSelectSuggestion, interpretations, suggestions, playSound,selectedIndex }: FormulaInputProps) {
    return (
        <div className="flex flex-col gap-2 mb-4 w-full">
            <input 
            type="text"
            value={formula}
            onChange={(e) => {
                onFormulaChange(e.target.value);
            }}
            placeholder="Enter formula (e.g. H2O, NaCl, Ca(OH)2)"
            className="
                input-glow ripple-input
                px-4 py-3 rounded-xl border-2
                bg-white/70 backdrop-blur-sm
                transition-all duration-300
                focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                text-base font-mono tracking-wide
                placeholder:text-gray-400
            "
            />
            {formula && interpretations.length > 0 && (
                <p className="text-xs text-gray-400 ml-1">
                    {interpretations.length} possible interpretations found
                </p>
            )}
            {suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
                <p className="text-xs font-medium text-gray-600 mb-2">🤔 Did you mean:</p>
                {suggestions.map((s, i) => (
                <button
                    key={i}
                    onClick={() => {
                        onSelectSuggestion(s.originalIndex);
                        playSound('click');
                    }}
                    className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        border
                        ${selectedIndex === s.originalIndex
                            ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                            : "bg-white hover:bg-blue-50 border-gray-200 text-gray-700"}
                    `}
                >
                    {s.label}
                </button>
                ))}
            </div>
            )}
            <p className="text-xs text-gray-500 ml-1">✨ Try: H2O, CO2, Fe2O3, Ca(OH)2</p>
        </div>
    )
}