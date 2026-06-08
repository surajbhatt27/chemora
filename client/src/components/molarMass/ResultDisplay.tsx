type Props = {
    result: number | null;
    displayResult: string;
    isCalculating: boolean;
};

export default function ResultDisplay({ result, displayResult }: Props) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">=</span>
            <span className="text-base sm:text-lg font-semibold text-white">
                {displayResult || (result !== null ? `${result.toFixed(4)} g/mol` : "—")}
            </span>
        </div>
    );
}