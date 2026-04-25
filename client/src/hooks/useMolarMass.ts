import { useState, useMemo } from "react";
import atomicMass from "../data/atomicMass";
import { getInterpretations, scoreInterpretation } from "../utils/parser";
import confetti from "canvas-confetti";
import { sounds, vibrate } from "../utils/sound";
import type { Row } from "../types";


export function useMolarMass() {
    const [result, setResult] = useState<number | null>(null);
    const [formula, setFormula] = useState("");
    const [rows, setRows] = useState<Row[]>([]);
    const [mode, setMode] = useState<"formula" | "manual">("formula");
    const [error, setError] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [displayResult, setDisplayResult] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const playSound = (name: "click" | "success" | "pop" | "error") => {
        if (soundEnabled) sounds[name]();
    };

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

    const finalError =
        mode === "manual"
        ? error
        : interpretations.length === 0
        ? "Invalid formula"
        : null;

    const typewriter = (text: string, cb?: () => void) => {
        let i = 0;
        setDisplayResult("");
        const interval = setInterval(() => {
        if (i < text.length) {
            setDisplayResult(text.slice(0, i + 1));
            i++;
        } else {
            clearInterval(interval);
            cb?.();
        }
        }, 30);
    };

    const calculateMass = async () => {
        if (isCalculating) return;

        playSound("click");
        setIsCalculating(true);

        let total = 0;
        for (const row of displayRows) {
        if (!atomicMass[row.element]) {
            playSound("error");
            vibrate(200);
            setIsCalculating(false);
            return;
        }
        total += atomicMass[row.element] * row.quantity;
        }

        playSound("success");
        vibrate([100, 50, 100]);

        const text = `${total.toFixed(4)} g/mol`;

        typewriter(text, () => setIsCalculating(false));
        setResult(total);

        if (total > 0 && !finalError) {
        confetti({ particleCount: 120, spread: 70 });
        }
    };

    return {
        // state
        result,
        formula,
        rows,
        mode,
        error,
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
    };
}