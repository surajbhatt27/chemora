import { describe, expect, it } from "vitest";
import { parseFormulaStrict, readFormula } from "./parseFormula";

describe("parseFormulaStrict", () => {
  it("accepts formulas with a single reading", () => {
    expect(parseFormulaStrict("H2O")).toEqual({ H: 2, O: 1 });
    expect(parseFormulaStrict("Ca(OH)2")).toEqual({ Ca: 1, O: 2, H: 2 });
  });

  it("uses capitalization to settle element-vs-elements readings", () => {
    expect(parseFormulaStrict("Co")).toEqual({ Co: 1 });
    expect(parseFormulaStrict("CO")).toEqual({ C: 1, O: 1 });
  });

  it("refuses to guess when the input can be read more than one way", () => {
    expect(() => parseFormulaStrict("co")).toThrow(/Ambiguous formula "co"/);
    expect(() => parseFormulaStrict("co")).toThrow(/Co = cobalt/);
  });

  it("rejects formulas with no valid reading", () => {
    expect(() => parseFormulaStrict("Xx2")).toThrow(/Invalid formula/);
  });
});

describe("readFormula", () => {
  it("keeps only the reading the typed capitalization picks", () => {
    expect(readFormula("CaCO3")).toEqual({
      rows: [
        { element: "Ca", quantity: 1 },
        { element: "C", quantity: 1 },
        { element: "O", quantity: 3 },
      ],
      error: null,
    });
  });

  it("refuses case-ambiguous input instead of ranking a rare element first", () => {
    // Lenient parsing tied Ca + C + O3 against C + Ac + O3 and kept actinium.
    for (const formula of ["caco3", "Caco3", "caCO3"]) {
      const { rows, error } = readFormula(formula);

      expect(rows).toEqual([]);
      expect(error).toMatch(/Ambiguous formula/);
      expect(error).toMatch(/Co = cobalt/);
    }
  });

  it("accepts lowercase input with a single possible reading", () => {
    expect(readFormula("h2o")).toEqual({
      rows: [
        { element: "H", quantity: 2 },
        { element: "O", quantity: 1 },
      ],
      error: null,
    });
  });

  it("reports invalid input", () => {
    expect(readFormula("Xx2")).toEqual({
      rows: [],
      error: 'Invalid formula: "Xx2"',
    });
  });
});
