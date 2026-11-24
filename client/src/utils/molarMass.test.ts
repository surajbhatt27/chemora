import { describe, expect, it } from "vitest";
import { getMolarMass } from "./molarMass";

describe("getMolarMass", () => {
  it.each([
    // IUPAC atomic weights from src/data/atomicMass.ts
    ["H2O", 18.015],
    ["CO2", 44.009],
    ["NaCl", 58.4398],
    ["O2", 31.998],
    ["C6H12O6", 180.156],
    ["Ca(OH)2", 74.092],
    ["H2SO4", 98.072],
    ["Al2(SO4)3", 342.1311],
    ["CaCO3", 100.086],
  ])("computes %s", (formula, expected) => {
    expect(getMolarMass(formula)).toBeCloseTo(expected, 3);
  });

  it("handles multi-digit subscripts and nested groups", () => {
    expect(getMolarMass("C12H22O11")).toBeCloseTo(342.297, 3);
    expect(getMolarMass("K4(Fe(CN)6)")).toBeCloseTo(368.346, 3);
  });

  it("is case-sensitive for two-letter elements", () => {
    expect(getMolarMass("Co")).toBeCloseTo(58.933, 3);
    expect(getMolarMass("CO")).toBeCloseTo(28.01, 3);
  });

  it("returns 0 for empty or unparseable input", () => {
    expect(getMolarMass("")).toBe(0);
    expect(getMolarMass("   ")).toBe(0);
    expect(getMolarMass("Xx2")).toBe(0);
  });
});
