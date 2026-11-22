import type { Compound, Equation } from "./parseEquation";

export function getAllElements(equation: Equation): string[] {
    const set = new Set<string>();

    const collect = (compounds: Compound[]) => {
        compounds.forEach((c) => {
        Object.keys(c.elements).forEach((el) => set.add(el));
        });
    };

    collect(equation.reactants);
    collect(equation.products);

    return Array.from(set);
}