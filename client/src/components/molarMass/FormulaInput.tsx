interface FormulaInputProps {
    formula: string;
    onFormulaChange: (value: string) => void;
}

export default function FormulaInput({
    formula,
    onFormulaChange,
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

            <p className="text-xs text-gray-600 mt-3">
                Examples: H2O, CO2, Fe2O3, Ca(OH)2
            </p>
        </div>
    );
}