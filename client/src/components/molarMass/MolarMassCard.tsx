import ModeToggle from "./ModeToggle";
import ResultDisplay from "./ResultDisplay";
import ManualInputSection from "./ManualInputSection";
import FormulaInput from "./FormulaInput";
import ParsedResult from "./ParsedResult";
import CalculateButton from "./CalculateButton";
import { useMolarMass } from "../../hooks/useMolarMass";

export default function MolarMassCard() {
    const {
        // state
        result,
        formula,
        rows,
        mode,
        isCalculating,
        displayResult,
        selectedIndex,
        soundEnabled,

        // derived
        interpretations,
        best,
        displayRows,
        finalError,

        // actions
        setFormula,
        setRows,
        setMode,
        setError,
        setSelectedIndex,
        setSoundEnabled,
        calculateMass,
        playSound,
    } = useMolarMass();

    // manual handlers (still here, lightweight)
    const addRow = () => {
        setRows([...rows, { element: "", quantity: 1 }]);
        setError(null);
    };

    const handleRemove = (indexToRemove: number) => {
        setRows(rows.filter((_, i) => i !== indexToRemove));
    };

    const handleChange = (
        index: number,
        field: "element" | "quantity",
        value: string | number
    ) => {
        const updated = [...rows];
        if (field === "quantity") {
        updated[index].quantity = Number(value);
        } else {
        updated[index].element = value as string;
        }
        setRows(updated);
    };

    return (
        <div className="p-4 sm:p-6 bg-white shadow-xl mt-4 sm:mt-6 w-full max-w-lg mx-auto rounded-2xl border relative">
        
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Molar Mass Calculator
        </h2>

        {/* 🔊 Sound Toggle */}
        <button
            onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled) playSound("click");
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm"
        >
            {soundEnabled ? "🔊" : "🔇"}
        </button>

        {/*  Mode Toggle */}
        <ModeToggle mode={mode} setMode={setMode} playSound={playSound} />

        {/*  Parsed Result */}
        <ParsedResult
            formula={formula}
            displayRows={displayRows}
            finalError={finalError}
            best={best}
        />

        {/*  Formula Input */}
        {mode === "formula" && (
            <FormulaInput
            formula={formula}
            selectedIndex={selectedIndex}
            interpretations={interpretations}
            suggestions={interpretations.filter(
                (i) => i.originalIndex !== selectedIndex
            )}
            playSound={playSound}
            onFormulaChange={(val) => {
                setFormula(val);
                setSelectedIndex(0);
                setError(null);
            }}
            onSelectSuggestion={(index) => setSelectedIndex(index)}
            />
        )}

        {/*  Manual Input */}
        {mode === "manual" && (
            <ManualInputSection
            rows={rows}
            addRow={addRow}
            handleChange={handleChange}
            handleRemove={handleRemove}
            />
        )}

        {/*  Bottom Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 p-3 bg-gray-100 rounded-xl">
            
            <CalculateButton
            onClick={calculateMass}
            isCalculating={isCalculating}
            disabled={
                !!finalError ||
                (mode === "formula" && displayRows.length === 0) ||
                (mode === "manual" && rows.length === 0)
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