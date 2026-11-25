import { useState, useMemo } from "react";
import { getMolarMass } from "../utils/molarMass";
import { readFormula } from "../utils/parseFormula";

const EMPTY = {
    rows: [] as { element: string; quantity: number }[],
    error: null as string | null,
};

export function useMolarMass() {
    const [formula, setFormula] = useState("");
    const [isCalculating, setIsCalculating] = useState(false);
    const [displayResult, setDisplayResult] = useState("");

    // Typed capitalization decides the reading; case-ambiguous input comes back
    // as an error rather than quietly using a different compound.
    const parsed = useMemo(
        () => (formula.trim() ? readFormula(formula) : EMPTY),
        [formula]
    );

    // A result belongs to the formula it was calculated for, so editing the
    // formula clears it instead of leaving a stale mass on screen.
    const updateFormula = (value: string) => {
        setFormula(value);
        setDisplayResult("");
    };

    const calculateMass = () => {
        if (isCalculating) return;

        setIsCalculating(true);
        setDisplayResult(`${getMolarMass(formula).toFixed(4)} g/mol`);
        setIsCalculating(false);
    };

    return {
        // state
        formula,
        isCalculating,
        displayResult,

        // derived
        displayRows: parsed.rows,
        finalError: parsed.error,

        // actions
        setFormula: updateFormula,
        calculateMass,
    };
}