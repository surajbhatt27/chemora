import type { Element } from "../../types/element";

interface Props {
    element: Element;
    onClick: (element: Element) => void;
}

const categoryColors: Record<Element["category"], string> = {
    "alkali metal": "bg-red-900/50 border-red-700 hover:bg-red-900/70",
    "alkaline earth metal": "bg-orange-900/50 border-orange-700 hover:bg-orange-900/70",
    "transition metal": "bg-yellow-900/50 border-yellow-700 hover:bg-yellow-900/70",
    "post-transition metal": "bg-green-900/50 border-green-700 hover:bg-green-900/70",
    lanthanide: "bg-teal-900/50 border-teal-700 hover:bg-teal-900/70",
    actinide: "bg-blue-900/50 border-blue-700 hover:bg-blue-900/70",
    nonmetal: "bg-gray-800/50 border-gray-600 hover:bg-gray-800/70",
    "noble gas": "bg-purple-900/50 border-purple-700 hover:bg-purple-900/70",
    halogen: "bg-cyan-900/50 border-cyan-700 hover:bg-cyan-900/70",
};

export default function ElementCard({ element, onClick }: Props) {
    const colorClass = categoryColors[element.category];

    return (
        <button
            onClick={() => onClick(element)}
            className={`p-2 rounded-md border text-left transition-all ${colorClass} w-full`}
        >
            <div className="text-xs text-gray-400">{element.atomicNumber}</div>
            <div className="text-lg font-bold text-white">{element.symbol}</div>
            <div className="text-xs text-gray-400 truncate">{element.name}</div>
            <div className="text-xs text-gray-500 mt-1">{element.atomicMass.toFixed(2)}</div>
        </button>
    );
}