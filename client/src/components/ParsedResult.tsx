import  formatFormula  from "../utils/formatter";

interface Row {
    element: string;
    quantity: number;
}

interface ParsedResultProps {
    formula: string;
    displayRows: Row[];
    finalError: string | null;
    best?: { label: string } | null;
}

export default function ParsedResult({ formula, displayRows, finalError, best }: ParsedResultProps) {
    return (
        <div className="flex flex-col gap-2 mb-4 w-full">
            {best && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm mb-2">
                    ✅ Using best match: <span className="font-semibold">{best.label}</span>
                </div>
            )}

            {displayRows.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl mt-3 text-sm mobile-first">
                    <p className="text-gray-500 text-sm mt-1">
                        {formatFormula(formula)}
                    </p>
                    <p className="font-semibold mb-2 text-base">Parsed:</p>
                    <div className="space-y-2">
                        {displayRows.map((row, idx) => (
                            <div 
                                key={idx}
                                className="flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <span className="font-mono font-semibold text-gray-800">
                                    {row.element}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    × {row.quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {finalError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                    ❌ {finalError}
                </div>
            )}
        </div>
    );
}