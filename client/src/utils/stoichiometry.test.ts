import { describe, expect, it } from "vitest";
import { balanceEquation } from "./balanceEquation";
import { buildStoichiometry, type KnownAmount } from "./stoichiometry";

function solve(input: string, known: KnownAmount[]) {
  return buildStoichiometry(balanceEquation(input), known);
}

describe("buildStoichiometry", () => {
  it("scales every species from a known mass of one reactant", () => {
    // 4.032 g H2 = 2.000 mol; H2 has coefficient 2, so the extent is 1 mol.
    const result = solve("H2 + O2 -> H2O", [
      { index: 0, amount: 4.032, unit: "g" },
    ]);

    expect(result.mode).toBe("forward");
    expect(result.extent).toBeCloseTo(1, 9);
    expect(result.limiting).toBeNull();
    expect(result.excess).toEqual([]);
    expect(result.yields).toEqual([]);

    const [hydrogen, oxygen, water] = result.species;

    expect(hydrogen.formula).toBe("H2");
    expect(hydrogen.moles).toBeCloseTo(2, 9);
    expect(hydrogen.mass).toBeCloseTo(4.032, 9);

    expect(oxygen.moles).toBeCloseTo(1, 9);
    expect(oxygen.mass).toBeCloseTo(31.998, 6);

    expect(water.moles).toBeCloseTo(2, 9);
    expect(water.mass).toBeCloseTo(36.03, 6);
  });

  it("treats moles and grams of the same amount alike", () => {
    const fromGrams = solve("H2 + O2 -> H2O", [
      { index: 0, amount: 4.032, unit: "g" },
    ]);
    const fromMoles = solve("H2 + O2 -> H2O", [
      { index: 0, amount: 2, unit: "mol" },
    ]);

    expect(fromMoles.extent).toBeCloseTo(fromGrams.extent, 9);

    for (const [index, species] of fromMoles.species.entries()) {
      expect(species.moles).toBeCloseTo(fromGrams.species[index].moles, 9);
      expect(species.mass).toBeCloseTo(fromGrams.species[index].mass, 6);
    }
  });

  it.each([
    "H2 + O2 -> H2O",
    "N2 + H2 -> NH3",
    "Fe + O2 -> Fe2O3",
    "Al + HCl -> AlCl3 + H2",
    "CH4 + O2 -> CO2 + H2O",
    "C6H12O6 + O2 -> CO2 + H2O",
    "Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O",
    "KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2",
  ])("conserves mass across %s", (equation) => {
    const result = solve(equation, [{ index: 0, amount: 1, unit: "mol" }]);

    const massIn = result.species
      .filter((species) => species.side === "reactant")
      .reduce((sum, species) => sum + species.mass, 0);
    const massOut = result.species
      .filter((species) => species.side === "product")
      .reduce((sum, species) => sum + species.mass, 0);

    expect(massOut).toBeCloseTo(massIn, 6);
  });

  it("finds the limiting reagent and what is left over", () => {
    // H2 gives extent 0.4960, O2 gives 1.0001, so H2 limits.
    const result = solve("H2 + O2 -> H2O", [
      { index: 0, amount: 2, unit: "g" },
      { index: 1, amount: 32, unit: "g" },
    ]);

    expect(result.extent).toBeCloseTo(2 / 2.016 / 2, 9);
    expect(result.limiting?.formula).toBe("H2");
    expect(result.excess).toHaveLength(1);
    expect(result.excess[0].species.formula).toBe("O2");
    expect(result.excess[0].molesLeft).toBeCloseTo(0.504, 3);
    expect(result.excess[0].massLeft).toBeCloseTo(0.504 * 31.998, 2);
  });

  it("clears the excess when the amounts are in exact ratio", () => {
    const result = solve("H2 + O2 -> H2O", [
      { index: 0, amount: 4.032, unit: "g" },
      { index: 1, amount: 31.998, unit: "g" },
    ]);

    expect(result.limiting?.formula).toBe("H2");
    expect(result.excess).toEqual([]);
  });

  it("handles an equation with six species", () => {
    const result = solve("KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2", [
      { index: 0, amount: 2, unit: "mol" },
      { index: 1, amount: 32, unit: "mol" },
    ]);

    expect(result.species.map((species) => species.coefficient)).toEqual([
      2, 16, 2, 2, 8, 5,
    ]);
    expect(result.limiting?.formula).toBe("KMnO4");
    expect(result.species[5].moles).toBeCloseTo(5, 9);
    expect(result.excess).toHaveLength(1);
    expect(result.excess[0].species.formula).toBe("HCl");
    expect(result.excess[0].molesLeft).toBeCloseTo(16, 9);
  });

  it("scales backward from a product amount", () => {
    const result = solve("H2 + O2 -> H2O", [
      { index: 2, amount: 36.03, unit: "g" },
    ]);

    expect(result.mode).toBe("reverse");
    expect(result.extent).toBeCloseTo(1, 9);
    expect(result.limiting).toBeNull();
    expect(result.excess).toEqual([]);
    expect(result.yields).toEqual([]);
    // 2 H2 + O2 -> 2 H2O: 2 mol of water needs 2 mol H2 and 1 mol O2.
    expect(result.species[0].moles).toBeCloseTo(2, 9);
    expect(result.species[1].moles).toBeCloseTo(1, 9);
  });

  it("reports theoretical mass and percent yield for an entered product", () => {
    const result = solve("H2 + O2 -> H2O", [
      { index: 0, amount: 4.032, unit: "g" },
      { index: 2, amount: 27, unit: "g" },
    ]);

    // The product amount is a yield, not a constraint on the reaction.
    expect(result.extent).toBeCloseTo(1, 9);
    expect(result.yields).toHaveLength(1);

    const [water] = result.yields;

    expect(water.theoreticalMass).toBeCloseTo(36.03, 6);
    expect(water.actualMass).toBeCloseTo(27, 9);
    expect(water.percent).toBeCloseTo(74.94, 2);
    expect(water.overTheoretical).toBe(false);
  });

  it("computes a yield above 100 % but flags it", () => {
    const result = solve("H2 + O2 -> H2O", [
      { index: 0, amount: 4.032, unit: "g" },
      { index: 2, amount: 40, unit: "g" },
    ]);

    expect(result.yields[0].percent).toBeCloseTo(111.02, 1);
    expect(result.yields[0].overTheoretical).toBe(true);
  });

  it("keeps the same formula on both sides independent", () => {
    const result = solve("H2O -> H2O", [
      { index: 0, amount: 18.015, unit: "g" },
    ]);

    expect(result.species).toHaveLength(2);
    expect(result.species.map((species) => species.side)).toEqual([
      "reactant",
      "product",
    ]);
    expect(result.species[1].formula).toBe("H2O");
    expect(result.species[1].moles).toBeCloseTo(1, 9);
    expect(result.species[1].mass).toBeCloseTo(18.015, 6);
  });

  it("keeps species in reaction order and is deterministic", () => {
    const input = "CH4 + O2 -> CO2 + H2O";
    const known: KnownAmount[] = [{ index: 0, amount: 16.043, unit: "g" }];

    const first = solve(input, known);

    expect(first.species.map((species) => species.formula)).toEqual([
      "CH4",
      "O2",
      "CO2",
      "H2O",
    ]);
    expect(solve(input, known)).toEqual(first);
  });
});

describe("buildStoichiometry validation", () => {
  const balanced = balanceEquation("H2 + O2 -> H2O");

  it("requires at least one amount", () => {
    expect(() => buildStoichiometry(balanced, [])).toThrow(
      /at least one species/
    );
  });

  it("rejects zero, negative and non-finite amounts", () => {
    for (const amount of [0, -1, Number.NaN]) {
      expect(() =>
        buildStoichiometry(balanced, [{ index: 0, amount, unit: "g" }])
      ).toThrow(/greater than 0/);
    }
  });

  it("rejects a species that is not in the equation", () => {
    expect(() =>
      buildStoichiometry(balanced, [{ index: 9, amount: 1, unit: "g" }])
    ).toThrow(/does not belong/);
  });

  it("rejects two amounts for one species", () => {
    expect(() =>
      buildStoichiometry(balanced, [
        { index: 0, amount: 1, unit: "mol" },
        { index: 0, amount: 2, unit: "mol" },
      ])
    ).toThrow(/more than once/);
  });

  it("surfaces equation errors from the shared pipeline", () => {
    expect(() => balanceEquation("H2 + O2 -> H2")).toThrow(
      /cannot be balanced/
    );
    expect(() => balanceEquation("caco3 -> CaO + CO2")).toThrow(
      /Ambiguous formula/
    );
  });
});
