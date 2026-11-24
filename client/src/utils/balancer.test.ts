import { describe, expect, it } from "vitest";
import { parseEquation } from "./parseEquation";
import { getAllElements } from "./getElement";
import { buildEquations } from "./buildEquations";
import { solveMatrix } from "./solveMatrix";

// The full pipeline the Reaction Balancer runs: parse -> element matrix -> solve.
function balance(input: string): number[] {
  const equation = parseEquation(input);
  const elements = getAllElements(equation);
  return solveMatrix(buildEquations(equation, elements));
}

describe("balancer", () => {
  it.each([
    ["H2 + O2 -> H2O", [2, 1, 2]],
    ["N2 + H2 -> NH3", [1, 3, 2]],
    ["Fe + O2 -> Fe2O3", [4, 3, 2]],
    ["Al + HCl -> AlCl3 + H2", [2, 6, 2, 3]],
    ["CH4 + O2 -> CO2 + H2O", [1, 2, 1, 2]],
    ["C6H12O6 + O2 -> CO2 + H2O", [1, 6, 6, 6]],
    ["NaOH + H2SO4 -> Na2SO4 + H2O", [2, 1, 1, 2]],
    ["CaCO3 -> CaO + CO2", [1, 1, 1]],
    ["Cu + HNO3 -> Cu(NO3)2 + NO2 + H2O", [1, 4, 1, 2, 2]],
    ["Pb(NO3)2 + KI -> PbI2 + KNO3", [1, 2, 1, 2]],
    ["Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O", [3, 2, 1, 6]],
    ["KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2", [2, 16, 2, 2, 8, 5]],
  ])("balances %s", (equation, expected) => {
    expect(balance(equation)).toEqual(expected);
  });

  it("returns small whole numbers, never huge denominators", () => {
    // Regression guard: this equation used to yield coefficients around 1e16.
    const coefficients = balance("Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O");

    for (const coefficient of coefficients) {
      expect(Number.isInteger(coefficient)).toBe(true);
      expect(coefficient).toBeGreaterThan(0);
      expect(coefficient).toBeLessThan(1000);
    }
  });

  it("balances the same equation regardless of arrow style or typed coefficients", () => {
    const canonical = [3, 2, 1, 6];

    expect(balance("Ca(OH)2 + H3PO4 → Ca3(PO4)2 + H2O")).toEqual(canonical);
    expect(balance("3Ca(OH)2 + 2H3PO4 -> Ca3(PO4)2 + 6H2O")).toEqual(canonical);
  });

  it("rejects equations with no positive solution", () => {
    expect(() => balance("H2 + O2 -> H2")).toThrow(/cannot be balanced/);
    expect(() => balance("H2 -> H2O")).toThrow(/cannot be balanced/);
  });

  it("accepts an equation that is already balanced", () => {
    expect(balance("H2O -> H2O")).toEqual([1, 1]);
  });
});

describe("solveMatrix", () => {
  it("reduces fractional solutions to whole numbers", () => {
    // 3x - y = 0  =>  x : y = 1 : 3
    expect(solveMatrix([[3, -1]])).toEqual([1, 3]);
  });

  it("rejects empty input", () => {
    expect(() => solveMatrix([])).toThrow(/empty equation/);
    expect(() => solveMatrix([[]])).toThrow(/empty equation/);
  });

  it("rejects a matrix whose only solution is zero", () => {
    expect(() => solveMatrix([[0, 0]])).toThrow(/cannot be balanced/);
  });
});
