import atomicMass from "../data/atomicMass";
import { parseFormula } from "./parseFormula";

// Molar mass via the shared formula parser (handles multi-digit counts and groups).
// Returns 0 for empty or unparseable input so callers can treat it as "no result".
export function getMolarMass(formula: string): number {
    if (!formula.trim()) return 0;

    try {
        const elements = parseFormula(formula);
        return Object.entries(elements).reduce(
            (total, [element, count]) => total + atomicMass[element] * count,
            0
        );
    } catch {
        return 0;
    }
}
