import atomicMass from "../data/atomicMass";
import { parseFormulaStrict } from "./parseFormula";

// Molar mass via the shared formula parser (handles multi-digit counts and groups).
// Returns 0 for empty, unparseable or case-ambiguous input so callers can treat it
// as "no result" rather than calculating the mass of the wrong compound.
export function getMolarMass(formula: string): number {
    if (!formula.trim()) return 0;

    try {
        const elements = parseFormulaStrict(formula);
        return Object.entries(elements).reduce(
            (total, [element, count]) => total + atomicMass[element] * count,
            0
        );
    } catch {
        return 0;
    }
}
