import type { Element } from "../../types/element";
import { X } from "lucide-react";

interface Props {
    element: Element | null;
    onClose: () => void;
}

export default function ElementModal({ element, onClose }: Props) {
    if (!element) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-black border border-gray-700 rounded-lg max-w-md w-full p-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-3xl font-bold text-white">{element.symbol}</div>
                        <div className="text-gray-400 text-sm">{element.name}</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Atomic Number</span>
                        <span className="text-white font-mono">{element.atomicNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Atomic Mass</span>
                        <span className="text-white font-mono">{element.atomicMass.toFixed(4)} g/mol</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Category</span>
                        <span className="text-white capitalize">{element.category}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Period</span>
                        <span className="text-white">{element.period}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-400">Group</span>
                        <span className="text-white">{element.group}</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span className="text-gray-400">Electron Config</span>
                        <span className="text-white font-mono text-right">{element.electronConfig}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}