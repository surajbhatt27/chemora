export function getAllElements(equation: any): string[] {
    const set = new Set<string>();

    const collect = (compounds: any[]) => {
        compounds.forEach((c) => {
        Object.keys(c.elements).forEach((el) => set.add(el));
        });
    };

    collect(equation.reactants);
    collect(equation.products);

    return Array.from(set);
}