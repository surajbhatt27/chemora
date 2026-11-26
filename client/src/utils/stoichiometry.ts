import type { BalancedEquation } from "./balanceEquation";
import { getMolarMass } from "./molarMass";

export type Side = "reactant" | "product";

export type Species = {
  /** Stable key: position in [...reactants, ...products]. */
  index: number;
  side: Side;
  formula: string;
  coefficient: number;
  molarMass: number;
};

export type KnownAmount = {
  index: number;
  amount: number;
  unit: "g" | "mol";
};

export type SpeciesAmount = Species & {
  moles: number;
  mass: number;
};

export type Excess = {
  species: Species;
  molesLeft: number;
  massLeft: number;
};

export type Yield = {
  species: Species;
  theoreticalMass: number;
  actualMass: number;
  percent: number;
  overTheoretical: boolean;
};

export type StoichiometryResult = {
  species: SpeciesAmount[];
  /** Extent of reaction in mol. */
  extent: number;
  /** null unless two or more reactant amounts compete. */
  limiting: Species | null;
  excess: Excess[];
  mode: "forward" | "reverse";
  yields: Yield[];
};

// Leftovers below this are rounding noise, not unreacted reagent.
const LEFTOVER_EPSILON = 1e-9;

function buildSpecies(balanced: BalancedEquation): Species[] {
  const all = [...balanced.equation.reactants, ...balanced.equation.products];
  const reactantCount = balanced.equation.reactants.length;

  return all.map((compound, index) => {
    // solveMatrix already guarantees positive integer coefficients, so a
    // missing molar mass is the one failure left worth refusing loudly.
    const molarMass = getMolarMass(compound.formula);

    if (molarMass <= 0) {
      throw new Error(`Could not read the formula "${compound.formula}".`);
    }

    return {
      index,
      side: index < reactantCount ? ("reactant" as const) : ("product" as const),
      formula: compound.formula,
      coefficient: balanced.coefficients[index],
      molarMass,
    };
  });
}

function toMoles(known: KnownAmount, species: Species): number {
  if (!Number.isFinite(known.amount) || known.amount <= 0) {
    throw new Error("Enter an amount greater than 0.");
  }

  return known.unit === "mol" ? known.amount : known.amount / species.molarMass;
}

function resolveAmounts(
  species: Species[],
  known: KnownAmount[]
): { species: Species; moles: number }[] {
  const seen = new Set<number>();

  return known.map((entry) => {
    const target = species[entry.index];

    if (!target) {
      throw new Error("That amount does not belong to this equation.");
    }

    if (seen.has(entry.index)) {
      throw new Error(
        `An amount for ${target.formula} is listed more than once.`
      );
    }

    seen.add(entry.index);

    return { species: target, moles: toMoles(entry, target) };
  });
}

/**
 * Moles and masses for every species from the known amounts, plus the limiting
 * reagent, any excess left over, and percent yield for entered products.
 *
 * Amounts given for reactants scale forward; with none, a product amount scales
 * the reaction backward. A product amount entered alongside reactants is an
 * actual yield, never a second constraint on the reaction.
 */
export function buildStoichiometry(
  balanced: BalancedEquation,
  known: KnownAmount[]
): StoichiometryResult {
  const species = buildSpecies(balanced);

  if (known.length === 0) {
    throw new Error("Enter an amount for at least one species.");
  }

  const amounts = resolveAmounts(species, known);
  const reactantAmounts = amounts.filter(
    (entry) => entry.species.side === "reactant"
  );
  const productAmounts = amounts.filter(
    (entry) => entry.species.side === "product"
  );
  const forward = reactantAmounts.length > 0;

  // How far the reaction would run if this amount were the only limit.
  const extentOf = (entry: { species: Species; moles: number }) =>
    entry.moles / entry.species.coefficient;

  const extent = Math.min(
    ...(forward ? reactantAmounts : productAmounts).map(extentOf)
  );

  // A limiting reagent only exists when two reactant amounts compete.
  const limiting =
    reactantAmounts.length > 1
      ? reactantAmounts.reduce((min, entry) =>
          extentOf(entry) < extentOf(min) ? entry : min
        ).species
      : null;

  const speciesAmounts: SpeciesAmount[] = species.map((entry) => {
    const moles = entry.coefficient * extent;

    return { ...entry, moles, mass: moles * entry.molarMass };
  });

  const excess: Excess[] = limiting
    ? reactantAmounts
        .filter((entry) => entry.species.index !== limiting.index)
        .map((entry) => {
          const molesLeft = Math.max(
            0,
            entry.moles - entry.species.coefficient * extent
          );

          return {
            species: entry.species,
            molesLeft,
            massLeft: molesLeft * entry.species.molarMass,
          };
        })
        .filter((entry) => entry.molesLeft > LEFTOVER_EPSILON)
    : [];

  // In reverse mode a product amount is the input constraint, not an actual
  // yield, so only forward calculations report percent yield.
  const yields: Yield[] = forward
    ? productAmounts.map((entry) => {
        const theoreticalMass =
          entry.species.coefficient * extent * entry.species.molarMass;
        const actualMass = entry.moles * entry.species.molarMass;
        const percent = (actualMass / theoreticalMass) * 100;

        return {
          species: entry.species,
          theoreticalMass,
          actualMass,
          percent,
          overTheoretical: percent > 100,
        };
      })
    : [];

  return {
    species: speciesAmounts,
    extent,
    limiting,
    excess,
    mode: forward ? "forward" : "reverse",
    yields,
  };
}
