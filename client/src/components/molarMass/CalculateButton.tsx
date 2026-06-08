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
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                disabled
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
        >
            {isCalculating ? "Calculating..." : "Calculate"}
        </button>
    );
}