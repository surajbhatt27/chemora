import { getInterpretations } from "./chem/parser";

type Row = { element: string; quantity: number };

function toElementMap(rows: Row[]): Record<string, number> {
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

function ambiguousMessage(
    formula: string,
    compositions: Map<string, Record<string, number>>
): string {
    const options = [...compositions.values()].map(formatComposition);

    return `Ambiguous formula "${formula}": it could be ${options.join(
        " or "
    )}. Match the element capitalization (e.g. Co = cobalt, CO = carbon monoxide).`;
}

type Resolution =
    | { elements: Record<string, number>; error: null }
    | { elements: null; error: string };

/**
 * The one reading a typed formula is allowed to have. Capitalization settles it
 * when possible; otherwise input that can be read more than one way is refused
 * ("caco3" must not quietly become C + Ac + O3) instead of guessed.
 */
function resolveFormula(formula: string): Resolution {
    const clean = formula.replace(/\s+/g, "");

    const strict = getInterpretations(clean, { strictCase: true });

    if (strict.length && distinctCompositions(strict).size === 1) {
        return { elements: toElementMap(strict[0].rows), error: null };
    }

    const lenient = getInterpretations(clean);

    if (!lenient.length) {
        return { elements: null, error: `Invalid formula: "${formula}"` };
    }

    const compositions = distinctCompositions(lenient);

    if (compositions.size > 1) {
        return { elements: null, error: ambiguousMessage(formula, compositions) };
    }

    return { elements: toElementMap(lenient[0].rows), error: null };
}

/**
 * Element counts for a formula, or an error that says why it was refused.
 */
export function readFormula(formula: string): {
    rows: Row[];
    error: string | null;
} {
    const resolution = resolveFormula(formula);

    if (resolution.error !== null) {
        return { rows: [], error: resolution.error };
    }

    return {
        rows: Object.entries(resolution.elements).map(([element, quantity]) => ({
            element,
            quantity,
        })),
        error: null,
    };
}

/**
 * Element counts for a formula. Throws when the input is invalid or when the
 * typed capitalization does not settle which compound it is.
 */
export function parseFormulaStrict(formula: string): Record<string, number> {
    const resolution = resolveFormula(formula);

    if (resolution.error !== null) {
        throw new Error(resolution.error);
    }

    return resolution.elements;
}
