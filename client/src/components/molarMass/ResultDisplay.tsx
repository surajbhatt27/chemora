type Props = {
    result: number | null;
    displayResult: string;
    isCalculating: boolean;
};

export default function ResultDisplay({
    result,
    displayResult,
}: Props) {
    return (
        <div className="flex items-center justify-between sm:justify-end gap-2">
        <span className="text-zinc-400 font-medium">Result:</span>
        <span className="text-xl font-bold text-indigo-400">
            {displayResult || (result !== null ? `${result.toFixed(4)} g/mol` : "--")}
        </span>
        </div>
    );
}