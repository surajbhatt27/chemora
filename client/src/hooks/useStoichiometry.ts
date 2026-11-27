import { useMemo, useState } from "react";
import {
    balanceEquation,
    type BalancedEquation,
} from "../utils/balanceEquation";
import { formatEquation } from "../utils/formatEquation";
import {
    buildStoichiometry,
    type KnownAmount,
    type Side,
    type StoichiometryResult,
} from "../utils/stoichiometry";

export type Unit = "g" | "mol";

export type SpeciesRow = {
    index: number;
    side: Side;
    formula: string;
};

export type AmountDraft = {
    value: string;
    unit: Unit;
};

const DEFAULT_DRAFT: AmountDraft = { value: "", unit: "g" };

type Parsed = {
    balanced: BalancedEquation | null;
    species: SpeciesRow[];
    formatted: string;
    error: string;
    /** Species identity the drafts belong to; editing the equation retires them. */
    signature: string;
};

const EMPTY: Parsed = {
    balanced: null,
    species: [],
    formatted: "",
    error: "",
    signature: "",
};

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Something went wrong.";
}

const draftKey = (signature: string, index: number) => `${signature}:${index}`;

export function useStoichiometry() {
    const [equation, setEquation] = useState("");
    const [drafts, setDrafts] = useState<Record<string, AmountDraft>>({});

    const parsed = useMemo<Parsed>(() => {
        if (!equation.trim()) return EMPTY;

        try {
            const balanced = balanceEquation(equation);
            const all = [
                ...balanced.equation.reactants,
                ...balanced.equation.products,
            ];
            const reactantCount = balanced.equation.reactants.length;

            return {
                balanced,
                species: all.map((compound, index) => ({
                    index,
                    side: index < reactantCount ? "reactant" : "product",
                    formula: compound.formula,
                })),
                formatted: formatEquation(
                    balanced.equation,
                    balanced.coefficients
                ),
                error: "",
                signature: all.map((compound) => compound.formula).join("|"),
            };
        } catch (error) {
            return { ...EMPTY, error: errorMessage(error) };
        }
    }, [equation]);

    // Keying by signature means amounts typed for one equation never attach
    // themselves to a different species after the equation is edited.
    const amountFor = (index: number): AmountDraft =>
        drafts[draftKey(parsed.signature, index)] ?? DEFAULT_DRAFT;

    const updateDraft = (index: number, patch: Partial<AmountDraft>) =>
        setDrafts((current) => {
            const key = draftKey(parsed.signature, index);

            return {
                ...current,
                [key]: { ...(current[key] ?? DEFAULT_DRAFT), ...patch },
            };
        });

    const setAmount = (index: number, value: string) =>
        updateDraft(index, { value });

    const setUnit = (index: number, unit: Unit) => updateDraft(index, { unit });

    const calculation = useMemo<{
        result: StoichiometryResult | null;
        error: string;
    }>(() => {
        if (!parsed.balanced) return { result: null, error: "" };

        const known: KnownAmount[] = parsed.species.flatMap((row) => {
            const draft = drafts[draftKey(parsed.signature, row.index)];

            if (!draft || draft.value.trim() === "") return [];

            return [
                {
                    index: row.index,
                    amount: Number(draft.value),
                    unit: draft.unit,
                },
            ];
        });

        // An untouched form is not an error; the card renders a prompt instead.
        if (known.length === 0) return { result: null, error: "" };

        try {
            return {
                result: buildStoichiometry(parsed.balanced, known),
                error: "",
            };
        } catch (error) {
            return { result: null, error: errorMessage(error) };
        }
    }, [parsed, drafts]);

    const prompt =
        parsed.balanced && !calculation.result && !calculation.error
            ? "Enter an amount for at least one species."
            : "";

    return {
        equation,
        setEquation,

        species: parsed.species,
        formatted: parsed.formatted,
        equationError: parsed.error,

        result: calculation.result,
        amountError: calculation.error,
        prompt,

        amountFor,
        setAmount,
        setUnit,
    };
}
