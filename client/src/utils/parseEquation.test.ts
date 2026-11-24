import { describe, expect, it } from "vitest";
import { parseEquation } from "./parseEquation";

function formulas(input: string): string[] {
  const eq = parseEquation(input);
  return [...eq.reactants, ...eq.products].map((c) => c.formula);
}

describe("parseEquation", () => {
  it("splits reactants and products", () => {
    const eq = parseEquation("H2 + O2 -> H2O");

    expect(eq.reactants).toHaveLength(2);
    expect(eq.products).toHaveLength(1);
    expect(eq.reactants[0].elements).toEqual({ H: 2 });
    expect(eq.reactants[1].elements).toEqual({ O: 2 });
    expect(eq.products[0].elements).toEqual({ H: 2, O: 1 });
  });

  it("accepts the arrow forms people type or paste", () => {
    for (const arrow of ["->", "=>", "=", "→", "⟶"]) {
      expect(formulas(`H2 + O2 ${arrow} H2O`)).toEqual(["H2", "O2", "H2O"]);
    }
  });

  it("tolerates extra whitespace", () => {
    expect(formulas("  H2+O2->H2O  ")).toEqual(["H2", "O2", "H2O"]);
  });

  it("strips typed-in coefficients instead of trusting them", () => {
    expect(formulas("2H2 + O2 -> 2H2O")).toEqual(["H2", "O2", "H2O"]);
    expect(formulas("3 Ca(OH)2 + 2 H3PO4 -> Ca3(PO4)2 + 6 H2O")).toEqual([
      "Ca(OH)2",
      "H3PO4",
      "Ca3(PO4)2",
      "H2O",
    ]);
  });

  it("requires exactly one arrow", () => {
    expect(() => parseEquation("")).toThrow(/Enter a chemical equation/);
    expect(() => parseEquation("H2 + O2")).toThrow(/one arrow/);
    expect(() => parseEquation("H2 -> O2 -> H2O")).toThrow(/one arrow/);
  });

  it("requires a formula on both sides", () => {
    expect(() => parseEquation("-> H2O")).toThrow(/Both sides/);
    expect(() => parseEquation("H2 + O2 ->")).toThrow(/Both sides/);
  });

  it("rejects a dangling plus sign", () => {
    expect(() => parseEquation("H2 + -> H2O")).toThrow(/Missing formula/);
  });

  it("surfaces ambiguous formulas with the capitalization hint", () => {
    expect(() => parseEquation("co + O2 -> CoO")).toThrow(/Ambiguous formula/);
  });
});
