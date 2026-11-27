import { toSubscript } from "../../utils/chem/toSubscript";
import { formatQuantity } from "../../utils/formatQuantity";
import type { Yield } from "../../utils/stoichiometry";

export default function YieldPanel({ yields }: { yields: Yield[] }) {
    if (yields.length === 0) return null;

    return (
        <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Percent yield
            </p>

            {yields.map((entry) => (
                <div key={entry.species.index} className="text-sm">
                    <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
                        <span className="font-mono text-white">
                            {toSubscript(entry.species.formula)}
                        </span>
                        <span className="font-mono text-gray-300">
                            {formatQuantity(entry.actualMass)} g actual /{" "}
                            {formatQuantity(entry.theoreticalMass)} g theoretical
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">
                        {formatQuantity(entry.percent, 2)}% yield
                    </p>
                    {entry.overTheoretical && (
                        <p className="text-xs text-amber-400">
                            More than the theoretical maximum — check the actual
                            mass.
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
