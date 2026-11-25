type Props = {
    displayResult: string;
};

export default function ResultDisplay({ displayResult }: Props) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">=</span>
            <span className="text-base sm:text-lg font-semibold text-white">
                {displayResult || "—"}
            </span>
        </div>
    );
}