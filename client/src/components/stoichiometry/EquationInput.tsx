const inputClass =
    "w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors";

const EXAMPLES = [
    "CH4 + O2 -> CO2 + H2O",
    "H2 + O2 -> H2O",
    "CaCO3 -> CaO + CO2",
];

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function EquationInput({ value, onChange }: Props) {
    return (
        <div>
            <label
                htmlFor="stoichiometry-equation"
                className="block text-xs font-medium text-gray-500 mb-1"
            >
                Equation
            </label>
            <input
                id="stoichiometry-equation"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g., CH4 + O2 -> CO2 + H2O"
                autoComplete="off"
                spellCheck={false}
                className={inputClass}
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {EXAMPLES.map((example) => (
                    <button
                        key={example}
                        type="button"
                        onClick={() => onChange(example)}
                        className="px-2 py-1 rounded border border-gray-800 text-xs font-mono text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
                    >
                        {example}
                    </button>
                ))}
            </div>
        </div>
    );
}
