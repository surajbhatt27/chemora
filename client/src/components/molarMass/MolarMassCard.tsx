import ResultDisplay from "./ResultDisplay";
import FormulaInput from "./FormulaInput";
import ParsedResult from "./ParsedResult";
import CalculateButton from "./CalculateButton";
import { useMolarMass } from "../../hooks/useMolarMass";

export default function MolarMassCard() {
    const {
        result,
        formula,
        isCalculating,
        displayResult,
        selectedIndex,
        interpretations,
        best,
        displayRows,
        finalError,
        setFormula,
        setError,
        setSelectedIndex,
        calculateMass,
    } = useMolarMass();

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
                <h1 className="text-xl font-semibold text-white mb-1">
                    Molar Mass Calculator
                </h1>
                <p className="text-gray-400 text-sm mb-5">
                    Enter a chemical formula to calculate its molar mass.
                </p>

                <ParsedResult
                    formula={formula}
                    displayRows={displayRows}
                    finalError={finalError}
                    best={best}
                />

                <FormulaInput
                    formula={formula}
                    selectedIndex={selectedIndex}
                    interpretations={interpretations}
                    suggestions={interpretations.filter(
                        (i) => i.originalIndex !== selectedIndex
                    )}
                    onFormulaChange={(val) => {
                        setFormula(val);
                        setSelectedIndex(0);
                        setError(null);
                    }}
                    onSelectSuggestion={(index) => setSelectedIndex(index)}
                />

                <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-800">
                    <CalculateButton
                        onClick={calculateMass}
                        isCalculating={isCalculating}
                        disabled={!!finalError || displayRows.length === 0}
                    />
                    <ResultDisplay
                        result={result}
                        displayResult={displayResult}
                        isCalculating={isCalculating}
                    />
                </div>
            </div>
        </div>
    );
}