import { useStoichiometry } from "../../hooks/useStoichiometry";
import AmountInputs from "./AmountInputs";
import EquationInput from "./EquationInput";
import SpeciesTable from "./SpeciesTable";
import YieldPanel from "./YieldPanel";

const errorClass =
    "px-3 py-2 rounded-md bg-red-950/50 border border-red-800 text-red-400 text-sm";

export default function StoichiometryCard() {
    const {
        equation,
        setEquation,
        species,
        formatted,
        equationError,
        result,
        amountError,
        prompt,
        amountFor,
        setAmount,
        setUnit,
    } = useStoichiometry();

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
                <h1 className="text-xl font-semibold text-white mb-1">
                    Stoichiometry
                </h1>
                <p className="text-gray-400 text-sm mb-5">
                    Enter an equation and a known amount. Every species gets its
                    moles and mass, with the limiting reagent and percent yield.
                </p>

                <div className="space-y-4">
                    <EquationInput value={equation} onChange={setEquation} />

                    {equationError && (
                        <div className={errorClass}>{equationError}</div>
                    )}

                    {formatted && (
                        <p className="font-mono text-sm text-gray-200 break-all">
                            {formatted}
                            <span className="ml-2 text-xs text-gray-500">
                                (balanced)
                            </span>
                        </p>
                    )}

                    {species.length > 0 && (
                        <AmountInputs
                            species={species}
                            amountFor={amountFor}
                            onAmount={setAmount}
                            onUnit={setUnit}
                        />
                    )}

                    {amountError && (
                        <div className={errorClass}>{amountError}</div>
                    )}

                    <div aria-live="polite">
                        {prompt && (
                            <p className="text-sm text-gray-500">{prompt}</p>
                        )}

                        {result && (
                            <>
                                <SpeciesTable result={result} />
                                <YieldPanel yields={result.yields} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
