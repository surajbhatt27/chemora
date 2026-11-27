import { toSubscript } from "../../utils/chem/toSubscript";
import { formatQuantity } from "../../utils/formatQuantity";
import type { StoichiometryResult } from "../../utils/stoichiometry";

const rowGrid =
    "grid grid-cols-[1fr_3.25rem_4.25rem] sm:grid-cols-[1fr_2.5rem_4.5rem_5.5rem] gap-x-2 sm:gap-x-3 items-baseline";

const badgeClass = "text-xs px-1.5 py-0.5 rounded";

export default function SpeciesTable({
    result,
}: {
    result: StoichiometryResult;
}) {
    // A formula on both sides is ambiguous once subscripts replace the input.
    const counts = new Map<string, number>();
    result.species.forEach((row) =>
        counts.set(row.formula, (counts.get(row.formula) ?? 0) + 1)
    );
    const yielded = new Set(result.yields.map((entry) => entry.species.index));

    return (
        <div className="rounded-md border border-gray-800 p-3">
            <div
                className={`${rowGrid} pb-2 border-b border-gray-800 text-xs uppercase tracking-wide text-gray-500`}
            >
                <span>Species</span>
                <span className="hidden sm:block text-right">ν</span>
                <span className="text-right">mol</span>
                <span className="text-right">g</span>
            </div>

            {result.species.map((row) => (
                <div
                    key={row.index}
                    className={`${rowGrid} py-2 border-b border-gray-800 last:border-0 text-sm`}
                >
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        <span className="font-mono text-white break-all">
                            {toSubscript(row.formula)}
                            {(counts.get(row.formula) ?? 0) > 1 && (
                                <span className="text-gray-500">
                                    {" "}
                                    ({row.side})
                                </span>
                            )}
                        </span>
                        <span className="sm:hidden text-xs font-mono text-gray-500">
                            ν {row.coefficient}
                        </span>
                        {result.limiting?.index === row.index && (
                            <span className={`${badgeClass} bg-gray-800 text-white`}>
                                limiting
                            </span>
                        )}
                        {yielded.has(row.index) && (
                            <span
                                className={`${badgeClass} border border-gray-800 text-gray-400`}
                            >
                                actual
                            </span>
                        )}
                    </div>
                    <span className="hidden sm:block text-right font-mono text-gray-400">
                        {row.coefficient}
                    </span>
                    <span className="text-right font-mono text-gray-300">
                        {formatQuantity(row.moles)}
                    </span>
                    <span className="text-right font-mono text-gray-200">
                        {formatQuantity(row.mass)}
                    </span>
                </div>
            ))}

            <div className="pt-2 space-y-1 text-xs text-gray-500">
                {result.limiting ? (
                    <p>
                        Limiting reagent:{" "}
                        <span className="font-mono text-gray-300">
                            {toSubscript(result.limiting.formula)}
                        </span>
                    </p>
                ) : result.mode === "reverse" ? (
                    <p>Scaled backward from the product amount.</p>
                ) : (
                    <p>
                        Enter amounts for two or more reactants to find the
                        limiting reagent.
                    </p>
                )}

                {result.excess.map(({ species, molesLeft, massLeft }) => (
                    <p key={species.index}>
                        Excess{" "}
                        <span className="font-mono text-gray-300">
                            {toSubscript(species.formula)}
                        </span>
                        : {formatQuantity(molesLeft)} mol (
                        {formatQuantity(massLeft)} g) left
                    </p>
                ))}
            </div>
        </div>
    );
}
