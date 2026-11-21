import { parseFormulaStrict } from "./parseFormula";

export type Compound = {
    formula: string;
    elements: Record<string, number>;
};

export type Equation = {
    reactants: Compound[];
    products: Compound[];
};

export function parseEquation(input: string): Equation {
    // Accept "->", "=>", "=" and the arrow characters people type or paste.
    const normalized = input
        .replace(/[→⟶]/g, "->")
        .replace(/=>/g, "->")
        .replace(/=/g, "->")
        .trim();

    if (!normalized) {
        throw new Error("Enter a chemical equation, e.g. H2 + O2 -> H2O");
    }

    const parts = normalized.split("->");

    if (parts.length !== 2) {
        throw new Error(
            "Use exactly one arrow between reactants and products, e.g. H2 + O2 -> H2O"
        );
    }

    const [left, right] = parts;

    if (!left.trim() || !right.trim()) {
        throw new Error("Both sides of the arrow need at least one formula");
    }

    const parseSide = (side: string): Compound[] => {
        return side.split("+").map((raw) => {
            // Drop a typed-in coefficient (e.g. "2H2O"); the balancer computes them.
            const formula = raw.trim().replace(/^\d+\s*/, "");

            if (!formula) {
                throw new Error(`Missing formula in "${side.trim()}"`);
            }

            return {
                formula,
                elements: parseFormulaStrict(formula),
            };
        });
    };

    return {
        reactants: parseSide(left),
        products: parseSide(right),
    };
}
