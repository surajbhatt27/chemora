function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

// Convert to RREF
function rref(matrix: number[][]): number[][] {
    const m = matrix.map(row => [...row]);
    let lead = 0;

    for (let r = 0; r < m.length; r++) {
        if (lead >= m[0].length) return m;

        let i = r;
        while (m[i][lead] === 0) {
            i++;
            if (i === m.length) {
                i = r;
                lead++;
                if (lead === m[0].length) return m;
            }
        }

        // swap
        [m[i], m[r]] = [m[r], m[i]];

        // normalize row
        const val = m[r][lead];
        for (let j = 0; j < m[0].length; j++) {
            m[r][j] /= val;
        }

        // eliminate others
        for (let i2 = 0; i2 < m.length; i2++) {
            if (i2 !== r) {
                const factor = m[i2][lead];
                for (let j = 0; j < m[0].length; j++) {
                    m[i2][j] -= factor * m[r][j];
                }
            }
        }

        lead++;
    }

    return m;
}

export function solveMatrix(matrix: number[][]): number[] {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const r = rref(matrix);

    // solution vector
    const solution = new Array(cols).fill(0);

    // last variable = free variable = 1
    solution[cols - 1] = 1;

    // back substitute
    for (let i = rows - 1; i >= 0; i--) {
        const pivotCol = r[i].findIndex(v => Math.abs(v) > 1e-10);

        if (pivotCol === -1 || pivotCol === cols - 1) continue;

        let sum = 0;
        for (let j = pivotCol + 1; j < cols; j++) {
            sum += r[i][j] * solution[j];
        }

        solution[pivotCol] = -sum / r[i][pivotCol];
    }

    // convert to integers
    const denominators = solution.map(x => {
        const frac = x.toString().split(".");
        if (frac.length === 1) return 1;
        return Math.pow(10, frac[1].length);
    });

    const lcmAll = denominators.reduce((a, b) => lcm(a, b), 1);

    const integerSolution = solution.map(x => Math.round(x * lcmAll));

    // simplify
    const g = integerSolution.reduce((a, b) => gcd(a, b));
    return integerSolution.map(x => x / g);
}