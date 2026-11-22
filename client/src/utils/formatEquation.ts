import { toSubscript } from "./chem/toSubscript";
import type { Equation } from "./parseEquation";

export function formatEquation(eq: Equation, coeffs: number[]): string {
    const all = [...eq.reactants, ...eq.products];

    const parts = all.map((compound, i) => {
        const coeff = coeffs[i];

        return `${coeff > 1 ? coeff : ""}${toSubscript(compound.formula)}`;
    });

    const left = parts.slice(0, eq.reactants.length).join(" + ");
    const right = parts.slice(eq.reactants.length).join(" + ");

    return `${left} → ${right}`;
}