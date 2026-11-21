const EPSILON = 1e-10;

// Coefficients in a balanced equation are small; a bounded denominator keeps
// float noise from turning 1/3 into 3333333333333333/10^16.
const MAX_DENOMINATOR = 1000;

function gcd(a: number, b: number): number {
    let x = Math.abs(a);
    let y = Math.abs(b);

    while (y !== 0) {
        [x, y] = [y, x % y];
    }

    return x;
}

// Both arguments are positive integers (fraction denominators).
function lcm(a: number, b: number): number {
    return (a / gcd(a, b)) * b;
}

// Convert to RREF
function rref(matrix: number[][]): number[][] {
    const m = matrix.map(row => [...row]);
    let lead = 0;

    for (let r = 0; r < m.length; r++) {
        if (lead >= m[0].length) return m;

        let i = r;
        while (Math.abs(m[i][lead]) < EPSILON) {
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

// Best rational approximation with a bounded denominator (continued fractions).
// The finite check matters: a NaN would never terminate the loop below.
function toFraction(value: number): { numerator: number; denominator: number } {
    if (!Number.isFinite(value)) {
        throw new Error("This equation cannot be balanced");
    }

    const sign = value < 0 ? -1 : 1;
    let x = Math.abs(value);

    let h0 = 0;
    let h1 = 1;
    let k0 = 1;
    let k1 = 0;

    for (let i = 0; i < 32; i++) {
        const a = Math.floor(x);
        const h2 = a * h1 + h0;
        const k2 = a * k1 + k0;

        if (k2 > MAX_DENOMINATOR) break;

        h0 = h1;
        h1 = h2;
        k0 = k1;
        k1 = k2;

        const fraction = x - a;
        if (fraction < 1e-12) break;

        x = 1 / fraction;
    }

    return { numerator: sign * h1, denominator: k1 || 1 };
}

export function solveMatrix(matrix: number[][]): number[] {
    const rows = matrix.length;

    if (rows === 0 || matrix[0].length === 0) {
        throw new Error("Cannot balance an empty equation");
    }

    const cols = matrix[0].length;

    const r = rref(matrix);

    // solution vector
    const solution = new Array(cols).fill(0);

    // last variable = free variable = 1
    solution[cols - 1] = 1;

    // back substitute
    for (let i = rows - 1; i >= 0; i--) {
        const pivotCol = r[i].findIndex(v => Math.abs(v) > EPSILON);

        if (pivotCol === -1 || pivotCol === cols - 1) continue;

        let sum = 0;
        for (let j = pivotCol + 1; j < cols; j++) {
            sum += r[i][j] * solution[j];
        }

        solution[pivotCol] = -sum / r[i][pivotCol];
    }

    // Drop float noise before turning the values into exact fractions.
    const snapped = solution.map(v => (Math.abs(v) < 1e-9 ? 0 : v));
    const fractions = snapped.map(toFraction);

    const denominator = fractions.reduce(
        (acc, f) => lcm(acc, f.denominator),
        1
    );

    const integerSolution = fractions.map(f =>
        Math.round(f.numerator * (denominator / f.denominator))
    );

    // simplify
    const g = integerSolution.reduce((acc, v) => gcd(acc, v), 0);

    if (g === 0) {
        throw new Error("This equation cannot be balanced");
    }

    const result = integerSolution.map(v => v / g);

    // Every species must actually participate. A zero or negative coefficient
    // means the equation as typed has no positive solution (e.g. H2 + O2 -> H2).
    if (result.some(v => v <= 0)) {
        throw new Error("This equation cannot be balanced");
    }

    // If a real coefficient needed a denominator above MAX_DENOMINATOR, the
    // approximation above would round to wrong integers; verify against the
    // original matrix so that case fails loudly instead of silently.
    for (const row of matrix) {
        let residual = 0;
        let scale = 0;

        for (let j = 0; j < cols; j++) {
            const term = row[j] * result[j];
            residual += term;
            scale += Math.abs(term);
        }

        if (Math.abs(residual) > 1e-6 * Math.max(1, scale)) {
            throw new Error("This equation cannot be balanced");
        }
    }

    return result;
}
