import { toSubscript } from "./toSubscript";

export function formatEquation(eq: any, coeffs: number[]): string {
    const all = [...eq.reactants, ...eq.products];

    const parts = all.map((compound, i) => {
        const coeff = coeffs[i];

        return `${coeff > 1 ? coeff : ""}${toSubscript(compound.formula)}`;
    });

    const left = parts.slice(0, eq.reactants.length).join(" + ");
    const right = parts.slice(eq.reactants.length).join(" + ");

    return `${left} → ${right}`;
}