import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import {
    getEmpiricalFormula,
    getEmpiricalFormulaFromPercents,
    getPercentComposition,
    type ElementShare,
} from "../../utils/composition";

type Tab = "composition" | "empirical";

type PercentRow = {
    element: string;
    percent: string;
};

const inputClass =
    "w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors";

const tabClass =
    "px-2 py-1.5 rounded-md text-sm font-medium text-center transition-colors";

const TABS: { id: Tab; label: string }[] = [
    { id: "composition", label: "From Formula" },
    { id: "empirical", label: "From Percent" },
];

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Something went wrong.";
}

export default function CompositionCard() {
    const [tab, setTab] = useState<Tab>("composition");
    const [formula, setFormula] = useState("");
    const [rows, setRows] = useState<PercentRow[]>([
        { element: "", percent: "" },
        { element: "", percent: "" },
        { element: "", percent: "" },
    ]);

    const composition = useMemo<{
        shares: ElementShare[];
        empirical: string;
        error: string;
    }>(() => {
        if (!formula.trim()) {
            return { shares: [], empirical: "", error: "" };
        }

        try {
            return {
                shares: getPercentComposition(formula),
                empirical: getEmpiricalFormula(formula),
                error: "",
            };
        } catch (error) {
            return { shares: [], empirical: "", error: errorMessage(error) };
        }
    }, [formula]);

    const empirical = useMemo(() => {
        const entries = rows
            .filter((row) => row.element.trim() !== "")
            .map((row) => ({
                element: row.element,
                percent: Number(row.percent),
            }));

        if (entries.length === 0) {
            return { formula: "", error: "" };
        }

        try {
            return {
                formula: getEmpiricalFormulaFromPercents(entries),
                error: "",
            };
        } catch (error) {
            return { formula: "", error: errorMessage(error) };
        }
    }, [rows]);

    const totalMass = composition.shares.reduce(
        (sum, share) => sum + share.mass,
        0
    );

    const updateRow = (index: number, patch: Partial<PercentRow>) => {
        setRows((current) =>
            current.map((row, i) => (i === index ? { ...row, ...patch } : row))
        );
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
                <h1 className="text-xl font-semibold text-white mb-1">
                    Percent Composition
                </h1>
                <p className="text-gray-400 text-sm mb-5">
                    Mass percent of each element, and the empirical formula behind it.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6 border-b border-gray-800 pb-3">
                    {TABS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`${tabClass} ${
                                tab === id
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "composition" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Chemical Formula
                            </label>
                            <input
                                type="text"
                                value={formula}
                                onChange={(e) => setFormula(e.target.value)}
                                placeholder="e.g., H2O, CaCO3, C6H12O6"
                                className={inputClass}
                            />
                        </div>

                        {composition.error && (
                            <div className="px-3 py-2 rounded-md bg-red-950/50 border border-red-800 text-red-400 text-sm">
                                {composition.error}
                            </div>
                        )}

                        {composition.shares.length > 0 && (
                            <div className="rounded-md border border-gray-800 p-3 space-y-2">
                                <p className="text-xs text-gray-500 pb-2 border-b border-gray-800">
                                    Molar mass{" "}
                                    <span className="font-mono font-semibold text-white">
                                        {totalMass.toFixed(4)} g/mol
                                    </span>
                                </p>

                                {composition.shares.map((share) => (
                                    <div key={share.element}>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-mono font-medium text-white">
                                                {share.element}
                                            </span>
                                            <span className="text-gray-400 font-mono">
                                                {share.mass.toFixed(3)} g/mol ·{" "}
                                                {share.percent.toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="mt-1 h-1 rounded bg-gray-900">
                                            <div
                                                className="h-1 rounded bg-gray-400"
                                                style={{ width: `${share.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {composition.shares.length > 0 && (
                            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-gray-900 border border-gray-800">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Empirical formula
                                </span>
                                <span className="font-mono text-base font-semibold text-white">
                                    {composition.empirical}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {tab === "empirical" && (
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">
                            Enter the mass percent of each element. They must add up to
                            100; mole ratios are reduced to whole numbers.
                        </p>

                        <div className="space-y-2">
                            {rows.map((row, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={row.element}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                element: e.target.value,
                                            })
                                        }
                                        placeholder="Element"
                                        className={`${inputClass} w-24 font-mono`}
                                    />
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={row.percent}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                percent: e.target.value,
                                            })
                                        }
                                        placeholder="Mass %"
                                        className={inputClass}
                                    />
                                    <button
                                        onClick={() =>
                                            setRows((current) =>
                                                current.filter(
                                                    (_, i) => i !== index
                                                )
                                            )
                                        }
                                        disabled={rows.length === 1}
                                        aria-label="Remove element"
                                        className="px-2 rounded-md border border-gray-800 text-gray-500 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() =>
                                setRows((current) => [
                                    ...current,
                                    { element: "", percent: "" },
                                ])
                            }
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-300 bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add element
                        </button>

                        {empirical.error && (
                            <div className="px-3 py-2 rounded-md bg-red-950/50 border border-red-800 text-red-400 text-sm">
                                {empirical.error}
                            </div>
                        )}

                        {empirical.formula && (
                            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-gray-900 border border-gray-800">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Empirical formula
                                </span>
                                <span className="font-mono text-base font-semibold text-white">
                                    {empirical.formula}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
