type Props = {
    mode: "formula" | "manual";
    setMode: (mode: "formula" | "manual") => void;
    playSound: (sound: "click" | "success" | "pop" | "error") => void;
    };

    export default function ModeToggle({ mode, setMode, playSound }: Props) {
    return (
        <div className="flex gap-2 mb-5 touch-manipulation">
        <button
            onClick={() => {
            playSound("click");
            setMode("formula");
            }}
            className={`
            relative overflow-hidden
            flex-1 py-3 rounded-xl text-center text-sm sm:text-base font-semibold
            transition-all duration-300 ease-out
            active:scale-95
            ${
                mode === "formula"
                ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
            `}
        >
            <span className="relative z-10">📝 Formula</span>
            {mode === "formula" && (
            <span className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
            )}
        </button>

        <button
            onClick={() => {
            playSound("click");
            setMode("manual");
            }}
            className={`
            relative overflow-hidden
            flex-1 py-3 rounded-xl text-center text-sm sm:text-base font-semibold
            transition-all duration-300 ease-out
            active:scale-95
            ${
                mode === "manual"
                ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
            `}
        >
            <span className="relative z-10">✋ Manual</span>
            {mode === "manual" && (
            <span className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
            )}
        </button>
        </div>
    );
}