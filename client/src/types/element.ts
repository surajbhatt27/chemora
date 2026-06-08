export type ElementCategory =
    | "alkali metal"
    | "alkaline earth metal"
    | "transition metal"
    | "post-transition metal"
    | "lanthanide"
    | "actinide"
    | "nonmetal"
    | "noble gas"
    | "halogen";

export interface Element {
    atomicNumber: number;
    symbol: string;
    name: string;
    atomicMass: number;
    category: ElementCategory;
    period: number;
    group: number;
    electronConfig: string;
}