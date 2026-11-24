import { describe, expect, it } from "vitest";
import {
  getEmpiricalFormula,
  getEmpiricalFormulaFromPercents,
  getPercentComposition,
} from "./composition";

describe("getPercentComposition", () => {
  it.each([
    // Masses derived from src/data/atomicMass.ts, so these guard the shipped weights.
    ["H2O", { H: 11.1907, O: 88.8093 }, 18.015],
    ["CO2", { C: 27.2921, O: 72.7079 }, 44.009],
    ["NaCl", { Na: 39.3393, Cl: 60.6607 }, 58.4398],
    ["CaCO3", { Ca: 40.0436, C: 12.0007, O: 47.9558 }, 100.086],
    ["C6H12O6", { C: 40.002, H: 6.7142, O: 53.2838 }, 180.156],
    ["H2SO4", { H: 2.0556, S: 32.6903, O: 65.2541 }, 98.072],
  ] as [string, Record<string, number>, number][])(
    "splits %s by mass",
    (formula, expected, molarMass) => {
      const shares = getPercentComposition(formula);

      expect(shares.map((share) => share.element)).toEqual(
        Object.keys(expected)
      );

      for (const share of shares) {
        expect(share.percent).toBeCloseTo(expected[share.element], 3);
        expect(share.mass).toBeCloseTo(
          (expected[share.element] / 100) * molarMass,
          3
        );
      }

      const totalPercent = shares.reduce((sum, share) => sum + share.percent, 0);
      expect(totalPercent).toBeCloseTo(100, 6);
    }
  );

  it("keeps two-letter elements case-sensitive", () => {
    expect(getPercentComposition("Co")[0].element).toBe("Co");
    expect(getPercentComposition("CO")[0].element).toBe("C");
  });

  it("throws for empty or unparseable input", () => {
    expect(() => getPercentComposition("")).toThrow(/Enter a chemical formula/);
    expect(() => getPercentComposition("   ")).toThrow(
      /Enter a chemical formula/
    );
    expect(() => getPercentComposition("Xx2")).toThrow(/Invalid formula/);
  });
});

describe("getEmpiricalFormula", () => {
  it.each([
    ["C6H12O6", "CH2O"],
    ["H2O2", "HO"],
    ["N2O4", "NO2"],
    ["C2H4", "CH2"],
    ["C12H22O11", "C12H22O11"],
    ["CaCO3", "CaCO3"],
    ["H2SO4", "H2SO4"],
    ["Ca(OH)2", "CaO2H2"],
    ["K4(Fe(CN)6)", "K4FeC6N6"],
  ])("reduces %s to %s", (formula, expected) => {
    expect(getEmpiricalFormula(formula)).toBe(expected);
  });

  it("throws for unparseable input", () => {
    expect(() => getEmpiricalFormula("")).toThrow();
    expect(() => getEmpiricalFormula("Xx2")).toThrow(/Invalid formula/);
  });
});

describe("getEmpiricalFormulaFromPercents", () => {
  it.each([
    [
      "glucose percents",
      [
        { element: "C", percent: 40.0 },
        { element: "H", percent: 6.71 },
        { element: "O", percent: 53.29 },
      ],
      "CH2O",
    ],
    [
      "water percents",
      [
        { element: "H", percent: 11.19 },
        { element: "O", percent: 88.81 },
      ],
      "H2O",
    ],
    [
      "1 : 1.5 ratio scales up",
      [
        { element: "Fe", percent: 69.94 },
        { element: "O", percent: 30.06 },
      ],
      "Fe2O3",
    ],
    [
      "nitrogen dioxide",
      [
        { element: "N", percent: 30.4467 },
        { element: "O", percent: 69.5533 },
      ],
      "NO2",
    ],
    [
      "whitespace and empty rows are ignored",
      [
        { element: " C ", percent: 40 },
        { element: "", percent: 0 },
        { element: "H", percent: 6.71 },
        { element: "O", percent: 53.29 },
        { element: "S", percent: 0 },
      ],
      "CH2O",
    ],
    [
      "rounded experimental values",
      [
        { element: "C", percent: 40.1 },
        { element: "H", percent: 6.7 },
        { element: "O", percent: 53.2 },
      ],
      "CH2O",
    ],
  ])("derives %s", (_label, entries, expected) => {
    expect(getEmpiricalFormulaFromPercents(entries)).toBe(expected);
  });

  it("needs at least two usable elements", () => {
    expect(() =>
      getEmpiricalFormulaFromPercents([{ element: "O", percent: 100 }])
    ).toThrow(/at least two elements/);
    expect(() =>
      getEmpiricalFormulaFromPercents([
        { element: "C", percent: 0 },
        { element: "O", percent: 0 },
      ])
    ).toThrow(/at least two elements/);
  });

  it("rejects unknown and repeated elements", () => {
    expect(() =>
      getEmpiricalFormulaFromPercents([
        { element: "Xx", percent: 50 },
        { element: "O", percent: 50 },
      ])
    ).toThrow(/Unknown element/);

    expect(() =>
      getEmpiricalFormulaFromPercents([
        { element: "C", percent: 40 },
        { element: "C", percent: 20 },
        { element: "O", percent: 40 },
      ])
    ).toThrow(/more than once/);
  });

  it("refuses percentages that do not add up to 100", () => {
    // 40 + 80 fits a 1 : 1.5 ratio, but the total is wrong, so an element is missing.
    expect(() =>
      getEmpiricalFormulaFromPercents([
        { element: "C", percent: 40 },
        { element: "O", percent: 80 },
      ])
    ).toThrow(/add up to 100/);

    expect(() =>
      getEmpiricalFormulaFromPercents([
        { element: "H", percent: 5 },
        { element: "O", percent: 40 },
      ])
    ).toThrow(/should add up to 100/);
  });

  it("refuses ratios that only look like whole numbers", () => {
    // C 50 / H 50 gives H : C of about 11.9; rounding that to CH12 would be silent nonsense.
    expect(() =>
      getEmpiricalFormulaFromPercents([
        { element: "C", percent: 50 },
        { element: "H", percent: 50 },
      ])
    ).toThrow(/whole-number formula/);

    expect(() =>
      getEmpiricalFormulaFromPercents([
        { element: "C", percent: 30.65 },
        { element: "N", percent: 69.35 },
      ])
    ).toThrow(/whole-number formula/);
  });
});
