import { useState, useMemo } from "react";
import atomicMass from "../data/atomicMass";
import { getInterpretations, scoreInterpretation } from "../utils/parser";

export function useMolarMass() {
    const [result, setResult] = useState<number | null>(null);
    const [formula, setFormula] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [displayResult, setDisplayResult] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const interpretations = useMemo(() => {
        if (!formula.trim()) return [];

        return getInterpretations(formula)
        .sort(
            (a, b) =>
            scoreInterpretation(b.tokens) - scoreInterpretation(a.tokens)
        )
        .map((i, idx) => ({ ...i, originalIndex: idx }));
    }, [formula]);

    const best = interpretations[selectedIndex] || null;
    const displayRows = best?.rows || [];

    const finalError = interpretations.length === 0 ? "Invalid formula" : error;

    const calculateMass = async () => {
        if (isCalculating) return;

        setIsCalculating(true);

        let total = 0;
        for (const row of displayRows) {
        if (!atomicMass[row.element]) {
            setIsCalculating(false);
            return;
        }
        total += atomicMass[row.element] * row.quantity;
        }

        const text = `${total.toFixed(4)} g/mol`;
        setDisplayResult(text);
        setResult(total);
        setIsCalculating(false);
    };

    return {
        // state
        result,
        formula,
        error,
        isCalculating,
        displayResult,
        selectedIndex,

        // derived
        interpretations,
        best,
        displayRows,
        finalError,

        // actions
        setFormula,
        setError,
        setSelectedIndex,
        calculateMass,
    };
}