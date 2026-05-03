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
    return (
        <div className="flex flex-col gap-3 mb-4 w-full">
        {best && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-2 rounded-lg text-sm">
            ✓ Using best match: <span className="font-semibold">{best.label}</span>
            </div>
        )}

        {displayRows.length > 0 && (
            <div className="bg-zinc-900/50 p-4 rounded-xl">
            <p className="text-zinc-400 text-sm mb-2">{formula}</p>
            <p className="font-medium text-white mb-2">Parsed:</p>
            <div className="space-y-1">
                {displayRows.map((row, idx) => (
                <div
                    key={idx}
                    className="flex justify-between items-center py-1.5 px-2 rounded-lg"
                >
                    <span className="font-mono font-medium text-white">
                    {row.element}
                    </span>
                    <span className="text-zinc-400 text-sm">× {row.quantity}</span>
                </div>
                ))}
            </div>
            </div>
        )}

        {finalError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm">
            ✗ {finalError}
            </div>
        )}
        </div>
    );
}