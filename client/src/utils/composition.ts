import atomicMass from "../data/atomicMass";
import { getMolarMass } from "./molarMass";
import { parseFormulaStrict } from "./parseFormula";

export type ElementShare = {
    element: string;
    /** Mass this element contributes to one mole of the compound (g/mol). */
    mass: number;
    /** Mass percent of this element in the compound. */
    percent: number;
};

export type PercentEntry = {
    element: string;
    percent: number;
};

type Count = {
    element: string;
    count: number;
};

// How far a scaled mole ratio may sit from a whole number before we refuse it.
// Tight on purpose: 1 : 1.98 is data rounding, 1 : 11.9 is not.
const WHOLE_NUMBER_TOLERANCE = 0.02;

// Covers 1 : 1.5 and 1 : 1.333 style ratios without inventing huge subscripts.
const MAX_MULTIPLIER = 10;

// Mass percentages must account for the whole compound, give or take rounding.
const PERCENT_TOTAL_TOLERANCE = 1;

const NOT_WHOLE_NUMBER =
    "These percentages do not fit a whole-number formula. Check the values or their precision.";

function gcd(a: number, b: number): number {
    let x = Math.abs(Math.round(a));
    let y = Math.abs(Math.round(b));

    while (y) {
        const remainder = x % y;
        x = y;
        y = remainder;
    }

    return x || 1;
}

function gcdAll(values: number[]): number {
    return values.reduce((acc, value) => gcd(acc, value), 0) || 1;
}

function formatFormula(counts: Count[]): string {
    return counts
        .map(({ element, count }) => `${element}${count > 1 ? count : ""}`)
        .join("");
}

function reduceCounts(counts: Count[]): Count[] {
    const divisor = gcdAll(counts.map((entry) => entry.count));

    return counts.map((entry) => ({
        element: entry.element,
        count: Math.round(entry.count / divisor),
    }));
}

function getElementCounts(formula: string): Count[] {
    if (!formula.trim()) {
        throw new Error("Enter a chemical formula.");
    }

    // Strict parsing keeps a typo like "caco3" from silently becoming
    // C + Ac + O3 (actinium) instead of Ca + C + O3; its "Invalid formula" and
    // "Ambiguous formula" messages are what the card shows the user.
    const elements = parseFormulaStrict(formula);

    return Object.entries(elements).map(([element, count]) => ({
        element,
        count,
    }));
}

function hasWholeNumberRatios(ratios: number[], multiplier: number): boolean {
    return ratios.every((ratio) => {
        const scaled = ratio * multiplier;
        return Math.abs(scaled - Math.round(scaled)) <= WHOLE_NUMBER_TOLERANCE;
    });
}

/**
 * Mass percent of every element in a formula.
 * Throws when the formula cannot be parsed.
 */
export function getPercentComposition(formula: string): ElementShare[] {
    const counts = getElementCounts(formula);
    const total = getMolarMass(formula);

    return counts.map(({ element, count }) => {
        const mass = atomicMass[element] * count;

        return {
            element,
            mass,
            percent: (mass / total) * 100,
        };
    });
}

/**
 * Empirical formula of a molecular formula, e.g. C6H12O6 -> CH2O.
 * Subscripts are reduced by their greatest common divisor.
 */
export function getEmpiricalFormula(formula: string): string {
    return formatFormula(reduceCounts(getElementCounts(formula)));
}

/**
 * Empirical formula from mass percentages.
 * Percent is divided by atomic mass to get mole ratios, which are then scaled
 * to the smallest whole numbers (so 1 : 1.5 becomes 2 : 3). The percentages
 * must add up to 100 and yield whole-number ratios; anything else is rejected
 * rather than rounded into a plausible-looking formula.
 * Rows with an empty element or a non-positive percent are ignored.
 */
export function getEmpiricalFormulaFromPercents(
    entries: PercentEntry[]
): string {
    const usable = entries
        .map((entry) => ({
            element: entry.element.trim(),
            percent: entry.percent,
        }))
        .filter(
            (entry) =>
                entry.element !== "" &&
                Number.isFinite(entry.percent) &&
                entry.percent > 0
        );

    if (usable.length < 2) {
        throw new Error("Enter a mass percent for at least two elements.");
    }

    const seen = new Set<string>();

    for (const { element } of usable) {
        if (!(element in atomicMass)) {
            throw new Error(`Unknown element: "${element}".`);
        }

        if (seen.has(element)) {
            throw new Error(`Element "${element}" is listed more than once.`);
        }

        seen.add(element);
    }

    const total = usable.reduce((sum, entry) => sum + entry.percent, 0);

    if (Math.abs(total - 100) > PERCENT_TOTAL_TOLERANCE) {
        throw new Error(
            `Mass percentages should add up to 100 — these add up to ${total.toFixed(
                2
            )}%.`
        );
    }

    const moles = usable.map(
        ({ element, percent }) => percent / atomicMass[element]
    );
    const smallest = Math.min(...moles);
    const ratios = moles.map((value) => value / smallest);

    let multiplier = 1;

    while (
        multiplier <= MAX_MULTIPLIER &&
        !hasWholeNumberRatios(ratios, multiplier)
    ) {
        multiplier++;
    }

    if (multiplier > MAX_MULTIPLIER) {
        throw new Error(NOT_WHOLE_NUMBER);
    }

    return formatFormula(
        reduceCounts(
            usable.map((entry, index) => ({
                element: entry.element,
                count: Math.round(ratios[index] * multiplier),
            }))
        )
    );
}
