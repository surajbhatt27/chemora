import { getInterpretations, scoreInterpretation } from "./parser";

export function parseFormula(formula: string): Record<string, number> {
    const interpretations = getInterpretations(formula);

    if (!interpretations.length) {
        throw new Error(`Invalid formula: ${formula}`);
    }

  // pick best interpretation
    const best = interpretations.sort(
        (a, b) => scoreInterpretation(b.tokens) - scoreInterpretation(a.tokens)
    )[0];

    const result: Record<string, number> = {};

    best.rows.forEach((row) => {
        result[row.element] = row.quantity;
    });

    return result;
}