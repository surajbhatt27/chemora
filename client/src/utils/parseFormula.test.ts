import { describe, expect, it } from "vitest";
import { parseFormula, parseFormulaStrict } from "./parseFormula";

describe("parseFormula", () => {
  it.each([
    ["H2O", { H: 2, O: 1 }],
    ["NaCl", { Na: 1, Cl: 1 }],
    ["CO2", { C: 1, O: 2 }],
    ["C6H12O6", { C: 6, H: 12, O: 6 }],
    ["Fe2O3", { Fe: 2, O: 3 }],
    ["Ca(OH)2", { Ca: 1, O: 2, H: 2 }],
    ["Al2(SO4)3", { Al: 2, S: 3, O: 12 }],
    ["Mg(NO3)2", { Mg: 1, N: 2, O: 6 }],
    ["K4(Fe(CN)6)", { K: 4, Fe: 1, C: 6, N: 6 }],
    ["C12H22O11", { C: 12, H: 22, O: 11 }],
  ])("parses %s", (formula, expected) => {
    expect(parseFormula(formula)).toEqual(expected);
  });

  it("ignores whitespace inside a formula", () => {
    expect(parseFormula(" Ca (OH) 2 ")).toEqual({ Ca: 1, O: 2, H: 2 });
  });

  it("respects typed capitalization: Co is cobalt, CO is carbon monoxide", () => {
    expect(parseFormula("Co")).toEqual({ Co: 1 });
    expect(parseFormula("CO")).toEqual({ C: 1, O: 1 });
  });

  it("still guesses for all-lowercase input", () => {
    expect(parseFormula("h2o")).toEqual({ H: 2, O: 1 });
  });

  it("rejects formulas with unknown elements", () => {
    expect(() => parseFormula("Xx2")).toThrow(/Invalid formula/);
    expect(() => parseFormula("H2O)")).toThrow(/Invalid formula/);
  });
});

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
