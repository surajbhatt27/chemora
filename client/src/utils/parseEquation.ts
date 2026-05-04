import { parseFormula } from "./parseFormula";

type Compound = {
    formula: string;
    elements: Record<string, number>;
};

type Equation = {
    reactants: Compound[];
    products: Compound[];
};

export function parseEquation(input: string): Equation {
    // Normalize arrow
    const normalized = input.replace("=", "->");

    const [left, right] = normalized.split("->");

    if (!left || !right) {
        throw new Error("Invalid equation format");
    }

    const parseSide = (side: string): Compound[] => {
        return side.split("+").map((c) => {
            const formula = c.trim();

            return {
            formula,
            elements: parseFormula(formula),
            };
        });
    };

    return {
        reactants: parseSide(left),
        products: parseSide(right),
    };
}