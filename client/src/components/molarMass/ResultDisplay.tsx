type Props = {
    result: number | null;
    displayResult: string;
    isCalculating: boolean;
};

export default function ResultDisplay({
    result,
    displayResult,
    isCalculating,
    }: Props) {
    return (
        <div className="flex items-center justify-between sm:justify-end gap-2">
        <span className="text-gray-600 font-medium">Result:</span>

        <div className="relative">
            <span
            className="
                text-xl font-bold
                bg-linear-to-r from-green-500 to-emerald-500
                bg-clip-text text-transparent
                drop-shadow-sm
            "
            >
            {displayResult ||
                (result !== null ? `${result.toFixed(4)} g/mol` : "--")}
            </span>

            {isCalculating && displayResult && (
            <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-green-500 animate-pulse rounded-full"></span>
            )}
        </div>
        </div>
    );
}