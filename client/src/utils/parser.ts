import atomicMass from "../data/atomicMass";


type Row = {
    element: string;
    quantity: number;
};

type Token = {
    el: string;
    count: number;
};

const validElements = new Set(Object.keys(atomicMass));

function parseFormulaAll(
    str: string,
    validElements: Set<string>
): Token[][] {
    const results: Token[][] = [];

    function dfs(index: number, path: Token[]) {
        if (results.length > 50) return;

        if (index >= str.length) {
            results.push([...path]);
            return;
        }

        // CASE 1: OPEN BRACKET
        if (str[index] === "(") {
            let depth = 1;
            let j = index + 1;

            while (j < str.length && depth > 0) {
                if (str[j] === "(") depth++;
                else if (str[j] === ")") depth--;
                j++;
            }

            const inside = str.slice(index + 1, j - 1);

            // read multiplier
            let k = j;
            let numStr = "";
            while (k < str.length && /[0-9]/.test(str[k])) {
                numStr += str[k];
                k++;
            }
            const multiplier = numStr ? parseInt(numStr) : 1;

            const innerResults = parseFormulaAll(inside, validElements);

            for (const inner of innerResults) {
                const multiplied = inner.map(t => ({
                    el: t.el,
                    count: t.count * multiplier,
                }));

                dfs(k, [...path, ...multiplied]);
            }

            return;
        }

        // helper to read number
        function readNumber(i: number) {
            let numStr = "";
            while (i < str.length && /[0-9]/.test(str[i])) {
                numStr += str[i];
                i++;
            }
            return {
                value: numStr ? parseInt(numStr) : 1,
                nextIndex: i,
            };
        }

        // CASE 2: 1-letter element
        const one = str[index].toUpperCase();
        if (validElements.has(one)) {
            const { value, nextIndex } = readNumber(index + 1);

            dfs(nextIndex, [...path, { el: one, count: value }]);
        }

        // CASE 3: 2-letter element
        if (index + 1 < str.length) {
            const two =
                str[index].toUpperCase() +
                str[index + 1].toLowerCase();

            if (validElements.has(two)) {
                const { value, nextIndex } = readNumber(index + 2);

                dfs(nextIndex, [...path, { el: two, count: value }]);
            }
        }
    }

    dfs(0, []);
    return results;
}

function tokensToRows(tokens: Token[]): Row[] {
    const map: Record<string, number> = {};

    for (const t of tokens) {
        map[t.el] = (map[t.el] || 0) + t.count;
    }

    return Object.entries(map).map(([element, quantity]) => ({
        element,
        quantity,
    }));
}

function getInterpretations(formula: string) {
    const clean = formula.replace(/\s+/g, "");

    const tokenSets = parseFormulaAll(clean, validElements);

    return tokenSets
        .map(tokens => ({
            tokens,
            rows: tokensToRows(tokens),
            label: tokens
                .map(t => `${t.el}${t.count > 1 ? t.count : ""}`)
                .join(" + "),
        }))
        .filter(i =>
            i.rows.every(r => atomicMass[r.element])
        );
}

function scoreInterpretation(tokens: Token[]) {
    let score = 0;

    for (const t of tokens) {
        if (t.el.length === 2) score += 2;
        else score += 1;

        // small bonus for normal counts
        if (t.count <= 3) score += 0.5;
    }

    return score;
}

export {
    getInterpretations,
    scoreInterpretation
}