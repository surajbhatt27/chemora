type Props = {
    onClick: () => void;
    disabled: boolean;
    isCalculating: boolean;
};

export default function CalculateButton({
    onClick,
    disabled,
    isCalculating,
}: Props) {
    return (
        <button
        onClick={onClick}
        disabled={disabled}
        className={`
            flex-1 py-2.5 rounded-xl font-semibold
            transition-colors duration-200
            ${
            disabled
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }
        `}
        >
        {isCalculating ? "Calculating..." : "🧪 Calculate"}
        </button>
    );
}