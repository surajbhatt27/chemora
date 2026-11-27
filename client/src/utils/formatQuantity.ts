/**
 * Fixed-decimal display with trailing zeros trimmed. Four decimals is enough
 * for gram-scale amounts; a global sig-fig formatter is a separate concern.
 */
export function formatQuantity(value: number, maxDecimals = 4): string {
    if (!Number.isFinite(value)) return "—";

    return Number(value.toFixed(maxDecimals)).toString();
}
