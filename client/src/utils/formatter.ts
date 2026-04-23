
export default function formatFormula (formula: string) {
        const subScriptMap: Record<string, string>= {
            "0": "₀",
            "1": "₁",
            "2": "₂",
            "3": "₃",
            "4": "₄",
            "5": "₅",
            "6": "₆",
            "7": "₇",
            "8": "₈",
            "9": "₉",
        }
        return formula
        .split("")
        .map((char) => subScriptMap[char] || char)
        .join("")
    }