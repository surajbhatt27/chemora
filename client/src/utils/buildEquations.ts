export function buildEquations(equation: any, elements: string[]) {
    const allCompounds = [
        ...equation.reactants,
        ...equation.products,
    ];

    return elements.map((el) => {
        const row = allCompounds.map((compound, index) => {
        const count = compound.elements[el] || 0;

        // reactants positive, products negative
        return index < equation.reactants.length ? count : -count;
        });

        return row;
    });
}