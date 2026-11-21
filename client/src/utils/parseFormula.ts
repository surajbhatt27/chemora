import { getInterpretations, scoreInterpretation } from "./chem/parser";

type Row = { element: string; quantity: number };

export function toElementMap(rows: Row[]): Record<string, number> {
    const result: Record<string, number> = {};

    for (const row of rows) {
        result[row.element] = row.quantity;
    }

    return result;
}

function compositionKey(elements: Record<string, number>): string {
    return Object.keys(elements)
        .sort()
        .map((el) => `${el}${elements[el]}`)
        .join("|");
}

function formatComposition(elements: Record<string, number>): string {
    return Object.entries(elements)
        .map(([el, count]) => `${el}${count > 1 ? count : ""}`)
        .join(" + ");
}

type Interpretation = ReturnType<typeof getInterpretations>[number];

function distinctCompositions(
    interpretations: Interpretation[]
): Map<string, Record<string, number>> {
    const compositions = new Map<string, Record<string, number>>();

    for (const interpretation of interpretations) {
        const elements = toElementMap(interpretation.rows);
        compositions.set(compositionKey(elements), elements);
    }

    return compositions;
}

export function parseFormula(formula: string): Record<string, number> {
    const clean = formula.replace(/\s+/g, "");

    // Capitalization ("Co" vs "CO") settles most formulas without guessing.
    const strict = getInterpretations(clean, { strictCase: true });
    const interpretations = strict.length ? strict : getInterpretations(clean);

    if (!interpretations.length) {
        throw new Error(`Invalid formula: ${formula}`);
    }

    // Fallback for all-lowercase input: keep the previous best-guess behavior.
    const best = [...interpretations].sort(
        (a, b) => scoreInterpretation(b.tokens) - scoreInterpretation(a.tokens)
    )[0];

    return toElementMap(best.rows);
}

/**
 * Like parseFormula, but refuses to guess: throws when a formula can be read
 * more than one way and the typed capitalization does not settle it.
 */
export function parseFormulaStrict(formula: string): Record<string, number> {
    const clean = formula.replace(/\s+/g, "");

    const strict = getInterpretations(clean, { strictCase: true });

    if (strict.length) {
        const compositions = distinctCompositions(strict);

        if (compositions.size === 1) {
            return [...compositions.values()][0];
        }
    }

    const lenient = getInterpretations(clean);

    if (!lenient.length) {
        throw new Error(`Invalid formula: "${formula}"`);
    }

    const compositions = distinctCompositions(lenient);

    if (compositions.size === 1) {
        return [...compositions.values()][0];
    }

    const options = [...compositions.values()].map(formatComposition);

    throw new Error(
        `Ambiguous formula "${formula}": it could be ${options.join(
            " or "
        )}. Match the element capitalization (e.g. Co = cobalt, CO = carbon monoxide).`
    );
}
