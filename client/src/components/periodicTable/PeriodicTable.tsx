import { useState } from "react";
import { elements } from "../../data/elements";
import type { Element } from "../../types/element";
import ElementModal from "./ElementModal";

// Category colors
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

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredElements = elements.filter((el) =>
    el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const elementMap = new Map<string, Element>();
  filteredElements.forEach((el) => {
    elementMap.set(`${el.period}-${el.group}`, el);
  });

  const rows = [1, 2, 3, 4, 5, 6, 7];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const shouldShowCell = (period: number, group: number): boolean => {
    if (period === 1) return group === 1 || group === 18;
    if (period === 2 || period === 3) {
      return group === 1 || group === 2 || (group >= 13 && group <= 18);
    }
    return true;
  };

  return (
    <div className="px-4 py-6 overflow-x-hidden">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white mb-1">Periodic Table</h1>
        <p className="text-gray-400 text-sm">Search or browse all 118 elements</p>
      </div>

      {/* Search Bar */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-212.5">
          <div className="space-y-1.5">
            {rows.map((period) => (
              <div
                key={`row-${period}`}
                className="grid gap-1"
                style={{ gridTemplateColumns: "repeat(18, minmax(55px, 1fr))" }}
              >
                {columns.map((group) => {
                  const cellKey = `${period}-${group}`;
                  if (!shouldShowCell(period, group)) {
                    return <div key={cellKey} className="p-1" />;
                  }
                  const element = elementMap.get(cellKey);
                  if (element) {
                    const colorClass = categoryColors[element.category];
                    return (
                      <button
                        key={element.atomicNumber}
                        onClick={() => setSelectedElement(element)}
                        className={`p-1.5 rounded border transition-colors text-left ${colorClass}`}
                      >
                        <div className="text-[10px] text-gray-400">{element.atomicNumber}</div>
                        <div className="text-sm font-bold text-white">{element.symbol}</div>
                        <div className="text-[9px] text-gray-400 truncate">{element.name}</div>
                        <div className="text-[9px] text-gray-500">{element.atomicMass.toFixed(2)}</div>
                      </button>
                    );
                  }
                  return <div key={cellKey} className="p-1" />;
                })}
              </div>
            ))}
          </div>

          {/* Lanthanides & Actinides */}
          <div className="mt-4 pt-3 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-2">Lanthanides & Actinides</div>
            <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: "repeat(15, minmax(55px, 1fr))" }}>
              {elements.filter((el) => el.category === "lanthanide").map((el) => (
                <button
                  key={`lanthanide-${el.atomicNumber}`}
                  onClick={() => setSelectedElement(el)}
                  className={`p-1.5 rounded border transition-colors text-left ${categoryColors[el.category]}`}
                >
                  <div className="text-[10px] text-gray-400">{el.atomicNumber}</div>
                  <div className="text-sm font-bold text-white">{el.symbol}</div>
                  <div className="text-[9px] text-gray-400 truncate">{el.name}</div>
                </button>
              ))}
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(55px, 1fr))" }}>
              {elements.filter((el) => el.category === "actinide").map((el) => (
                <button
                  key={`actinide-${el.atomicNumber}`}
                  onClick={() => setSelectedElement(el)}
                  className={`p-1.5 rounded border transition-colors text-left ${categoryColors[el.category]}`}
                >
                  <div className="text-[10px] text-gray-400">{el.atomicNumber}</div>
                  <div className="text-sm font-bold text-white">{el.symbol}</div>
                  <div className="text-[9px] text-gray-400 truncate">{el.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden">
        <div className="space-y-1.5">
          {filteredElements.map((el) => {
            const colorClass = categoryColors[el.category];
            return (
              <button
                key={`mobile-${el.atomicNumber}`}
                onClick={() => setSelectedElement(el)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${colorClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 text-center">
                    <div className="text-xs text-gray-400">{el.atomicNumber}</div>
                    <div className="text-base font-bold text-white">{el.symbol}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">{el.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{el.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-300 font-mono">{el.atomicMass.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500">g/mol</div>
                </div>
              </button>
            );
          })}
        </div>
        
        {filteredElements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No elements found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-xs font-medium text-gray-500 mb-2">Categories:</p>
        <div className="flex flex-wrap gap-1.5 text-[10px] sm:text-xs">
          <span className="px-1.5 py-0.5 rounded bg-red-900/50 text-gray-300">Alkali</span>
          <span className="px-1.5 py-0.5 rounded bg-orange-900/50 text-gray-300">Alkaline</span>
          <span className="px-1.5 py-0.5 rounded bg-yellow-900/50 text-gray-300">Transition</span>
          <span className="px-1.5 py-0.5 rounded bg-green-900/50 text-gray-300">Post-Transition</span>
          <span className="px-1.5 py-0.5 rounded bg-teal-900/50 text-gray-300">Lanthanide</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-900/50 text-gray-300">Actinide</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-300">Nonmetal</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-900/50 text-gray-300">Noble</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-900/50 text-gray-300">Halogen</span>
        </div>
      </div>

      <ElementModal element={selectedElement} onClose={() => setSelectedElement(null)} />
    </div>
  );
}