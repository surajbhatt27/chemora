import { parseEquation, type Equation } from "./parseEquation";
import { getAllElements } from "./getElement";
import { buildEquations } from "./buildEquations";
import { solveMatrix } from "./solveMatrix";

export type BalancedEquation = {
  equation: Equation;
  /** Index-aligned with [...reactants, ...products]. */
  coefficients: number[];
};

/**
 * The one route from typed equation to integer coefficients. Shared by the
 * Reaction Balancer and stoichiometry so both agree on what is balanced.
 */
export function balanceEquation(input: string): BalancedEquation {
  const equation = parseEquation(input);
  const elements = getAllElements(equation);
  const coefficients = solveMatrix(buildEquations(equation, elements));

  return { equation, coefficients };
}
