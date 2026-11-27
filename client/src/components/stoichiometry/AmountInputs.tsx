import { toSubscript } from "../../utils/chem/toSubscript";
import type { AmountDraft, SpeciesRow, Unit } from "../../hooks/useStoichiometry";

const inputClass =
    "flex-1 min-w-0 px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors";

const GROUPS: { side: SpeciesRow["side"]; label: string }[] = [
    { side: "reactant", label: "Reactants" },
    { side: "product", label: "Products" },
];

type Props = {
    species: SpeciesRow[];
    amountFor: (index: number) => AmountDraft;
    onAmount: (index: number, value: string) => void;
    onUnit: (index: number, unit: Unit) => void;
};

export default function AmountInputs({
    species,
    amountFor,
    onAmount,
    onUnit,
}: Props) {
    return (
        <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Amounts
            </p>

            {GROUPS.map(({ side, label }) => {
                const rows = species.filter((row) => row.side === side);

                if (rows.length === 0) return null;

                return (
                    <div key={side} className="space-y-2">
                        <p className="text-xs text-gray-600">{label}</p>

                        {rows.map((row) => {
                            const draft = amountFor(row.index);
                            const inputId = `stoichiometry-amount-${row.index}`;

                            return (
                                <div
                                    key={row.index}
                                    className="flex items-center gap-2"
                                >
                                    <label
                                        htmlFor={inputId}
                                        className="w-24 shrink-0 font-mono text-sm text-white truncate"
                                    >
                                        {toSubscript(row.formula)}
                                    </label>
                                    <input
                                        id={inputId}
                                        type="text"
                                        inputMode="decimal"
                                        value={draft.value}
                                        onChange={(e) =>
                                            onAmount(row.index, e.target.value)
                                        }
                                        placeholder="—"
                                        className={`${inputClass} font-mono`}
                                    />
                                    <select
                                        aria-label={`Unit for ${row.formula}`}
                                        value={draft.unit}
                                        onChange={(e) =>
                                            onUnit(
                                                row.index,
                                                e.target.value as Unit
                                            )
                                        }
                                        className="w-20 shrink-0 px-2 py-2 rounded-md border border-gray-700 bg-black text-white text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
                                    >
                                        <option value="g">g</option>
                                        <option value="mol">mol</option>
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
