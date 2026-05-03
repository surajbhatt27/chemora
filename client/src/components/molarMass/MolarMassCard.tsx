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
        <div className="bg-zinc-800/60 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-zinc-700">
        <h2 className="text-xl font-semibold text-white mb-4">
            Molar Mass Calculator
        </h2>

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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 p-3 bg-zinc-900/50 rounded-xl">
            <CalculateButton
            onClick={calculateMass}
            isCalculating={isCalculating}
            disabled={
                !!finalError || displayRows.length === 0
            }
            />
            <ResultDisplay
            result={result}
            displayResult={displayResult}
            isCalculating={isCalculating}
            />
        </div>
        </div>
    );
}