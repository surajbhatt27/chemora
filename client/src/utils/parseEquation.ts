type Compound = {
    formula: string;
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
        return side.split("+").map((c) => ({
        formula: c.trim(),
        }));
    };

    return {
        reactants: parseSide(left),
        products: parseSide(right),
    };
}