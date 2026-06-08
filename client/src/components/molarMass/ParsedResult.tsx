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

export default function ParsedResult({
    formula,
    displayRows,
    finalError,
    best,
}: ParsedResultProps) {
    if (displayRows.length === 0 && !best && !finalError) return null;

    return (
        <div className="mb-5">
            {best && (
                <div className="mb-3 px-3 py-1.5 rounded-md bg-gray-900 border border-gray-800 text-gray-300 text-sm">
                    Using: {best.label}
                </div>
            )}

            {displayRows.length > 0 && (
                <div className="bg-black rounded-md border border-gray-800 p-3">
                    <p className="text-gray-400 text-sm font-mono mb-2 break-all">
                        {formula}
                    </p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Composition
                    </p>
                    <div className="space-y-0.5">
                        {displayRows.map((row, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="font-mono font-medium text-white">
                                    {row.element}
                                </span>
                                <span className="text-gray-400">{row.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {finalError && (
                <div className="px-3 py-2 rounded-md bg-red-950/50 border border-red-800 text-red-400 text-sm">
                    {finalError}
                </div>
            )}
        </div>
    );
}