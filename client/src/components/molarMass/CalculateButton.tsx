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
            px-6 py-3 rounded-xl text-white font-bold
            ${disabled ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}
        `}
        >
        {isCalculating ? "Calculating..." : "⚡ Calculate"}
        </button>
    );
}