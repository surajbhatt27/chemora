import { useState, useMemo } from "react";
import ElementRow from "./ElementRow";
import atomicMass from "../data/atomicMass";

export default function MolarMassCard() {

    type Row = {
        element: string;
        quantity: number;
    };

    const [result, setResult] = useState<number |null>(null)
    const [formula, setFormula] = useState<string>("")
    const [error, setError] = useState<string| null>(null)
    const [mode, setMode] = useState<"formula" | "manual">("formula");
    const validElements = new Set(Object.keys(atomicMass));

    // calculate mass
    const calculateMass = () => {
        let total = 0;

        for(const row of displayRows) {
            if (!atomicMass[row.element]) return;
            const mass = atomicMass[row.element]
            total += mass * row.quantity
        }
        setResult(total)
    }

    const [rows, setRows] = useState<Row[]>([])

    // add row
    const addRow = ()=> {
        setRows ([...rows, {element:"", quantity: 1}])
        setError(null)
    }

    // remove row
    const handleRemove = (indexToRemove: number)=> {
        const updateRows = rows.filter((_, index) => index !== indexToRemove)
        setRows(updateRows)
    }

    // changes on element and quantity
    const handleChange = (index: number, field: keyof Row, value: string|number) => {
        const updatedRows = [...rows]
        updatedRows[index][field] = value as never;
        setRows(updatedRows)
    }

    // normalization function
    function normalizeFormula(formula: string) {
        let result = ""
        let i=0
        while (i<formula.length) {
            const char = formula[i].toUpperCase()
            
            let twoChar = ""
            if(i+1 <formula.length) {
                twoChar = char + formula[i+1].toLowerCase()
            }

            if(validElements.has(twoChar)) {
                result += twoChar
                i += 2
            }
            else {
                result += char
                i += 1
            }
        }
        return result
    }


    // parsing of formula with brackets
    function parseFormulaWithBrackets(formula: string) {
        const stack: Record<string, number>[] = [{}];
        let i = 0;

        while (i < formula.length) {
            const char = formula[i];

            if (char === '(') {
                stack.push({});
                i++;
                continue;
            }

            if (char === ')') {
                i++;

                let numStr = "";
                while (i < formula.length && /[0-9]/.test(formula[i])) {
                    numStr += formula[i];
                    i++;
                }

                const multiplier = numStr ? parseInt(numStr) : 1;

                if(stack.length === 1) {
                    throw new Error("Invalid formula: extra closing bracket ')'")
                }

                const top = stack.pop()!;
                const prev = stack[stack.length - 1];

                for (const key in top) {
                    prev[key] = (prev[key] || 0) + top[key] * multiplier;
                }

                continue;
            }

            // element parsing
            let element = char;

            if (i + 1 < formula.length && /[a-z]/.test(formula[i + 1])) {
            element += formula[i + 1];
            i++;
            }

            i++;

            let numStr = "";
            while (i < formula.length && /[0-9]/.test(formula[i])) {
            numStr += formula[i];
            i++;
            }

            const quantity = numStr ? parseInt(numStr) : 1;

            const current = stack[stack.length - 1];
            current[element] = (current[element] || 0) + quantity;

            continue;
        }
        if (stack.length !== 1) {
            throw new Error("Invalid formula: missing closing bracket ')'");
        }

        return stack[0];
    }
    

    // parsing handlers
    const parsedData = useMemo(() => {
        if (!formula.trim()) {
            return { rows: [], error: null };
        }

        try {
            const clean = formula.replace(/\s+/g, "").trim();
            const normalized = normalizeFormula(clean);
            const parsedMap = parseFormulaWithBrackets(normalized);

            const rows = Object.entries(parsedMap).map(([element, quantity]) => ({
            element,
            quantity,
            }));

            for (const item of rows) {
                if (!(item.element in atomicMass)) {
                    return { rows: [], error: `Unknown element: ${item.element}` };
                }
                if (item.quantity <= 0) {
                    return { rows: [], error: "Quantity must be greater than 0" };
                }
            }
            return { rows, error: null };
        } catch (err: unknown) {
            if (err instanceof Error) {
            return { rows: [], error: err.message };
            }
            return { rows: [], error: "Invalid formula" };
        }
    }, [formula]);

    const parsedRows = parsedData.rows;
    const derivedError = parsedData.error;
    const displayRows = mode === "formula" ? parsedRows : rows;
    const finalError = mode === "formula" ? derivedError : error;

    return (
        <>
            <div className="p-4 sm:p-6 bg-white shadow-xl mt-4 sm:mt-6 w-full max-w-lg mx-auto rounded-2xl border">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Molar Mass Calculator</h2>
                <div className="
                flex 
                gap-2 
                mb-5
                touch-manipulation
                ">
                    <button 
                        onClick={() => setMode("formula")}
                        className={`
                        flex-1
                        py-3
                        rounded-xl
                        text-center
                        text-sm
                        sm:text-base
                        font-semibold
                        transition-all
                        duration-200
                        touch-manipulation
                        active:scale-95
                        
                        ${mode === "formula" 
                            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                        `}
                    >
                        📝 Formula
                    </button>

                    <button 
                        onClick={() => setMode("manual")}
                        className={`
                        flex-1
                        py-3
                        rounded-xl
                        text-center
                        text-sm
                        sm:text-base
                        font-semibold
                        transition-all
                        duration-200
                        touch-manipulation
                        active:scale-95
                        
                        ${mode === "manual" 
                            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                        `}
                    >
                        ✋ Manual
                    </button>
                </div>

                <div className="flex flex-col gap-2 mb-4 w-full">
                    {displayRows.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-xl mt-3 text-sm mobile-first">
                            <p className="font-semibold mb-2 text-base">Parsed:</p>
                            <div className="space-y-2">
                                {displayRows.map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0">
                                        <span className="font-mono font-medium">{row.element}</span>
                                        <span className="text-gray-600">→ {row.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {finalError  && (
                    <p className="text-red-500 text-sm mt-1">
                        {finalError }
                    </p>
                    )}
                </div>

                {mode === "formula" && (
                    <div className="flex flex-col gap-2 mb-4 w-full">
                        <input 
                        type="text"
                        value={formula}
                        onChange={(e)=> {
                            setFormula(e.target.value)
                            setError(null)
                        }}
                        placeholder="Enter formula" 
                        className="px-4 py-2 border rounded-xl" />
                    </div>
                )}

                {mode === "manual" && (
                <>
                    {rows.length === 0 && (
                        <div className="
                            text-center 
                            py-8 
                            px-4 
                            mt-4
                            bg-gray-50 
                            rounded-xl
                            border-2
                            border-dashed
                            border-gray-200
                            touch-manipulation
                        ">
                            {/* Icon */}
                            <svg 
                            className="
                                w-12 
                                h-12 
                                mx-auto 
                                mb-3 
                                text-gray-400
                                opacity-50
                            " 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                            </svg>
                            
                            <p className="
                            text-gray-500 
                            text-sm 
                            sm:text-base
                            mb-2
                            ">
                            No elements added yet
                            </p>
                            
                            <p className="
                            text-gray-400 
                            text-xs 
                            sm:text-sm
                            ">
                            Click "Add Element" to start building your formula
                            </p>
                        </div>
                    )}

                    <button onClick={addRow} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition w-full mb-3 cursor-pointer text-sm sm:text-base mt-3">add element</button>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {rows.map((row, index)=>(
                            <ElementRow 
                            key={index}
                            index={index}
                            row={row}
                            onRemove={handleRemove}
                            onChange={handleChange}
                            />
                        ))}
                    </div>
                </>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 p-3 bg-gray-100 rounded-xl">
                    <button 
                    onClick={calculateMass}
                    disabled={
                    !!finalError ||
                    (mode === "formula" && displayRows.length === 0) ||
                    (mode === "manual" && rows.length === 0)
                    }
                    className={`
                        px-4 py-2 
                        rounded-xl 
                        text-white 
                        text-sm 
                        sm:text-base 
                        font-medium
                        transition-all duration-200 ease-in-out
                        active:scale-95
                        touch-manipulation

                        ${error 
                        ? "bg-gray-400 cursor-not-allowed opacity-70" 
                        : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-md active:shadow-sm cursor-pointer"
                        }
                    `}
                    >
                    {finalError  ? "Fix errors to calculate" : "Calculate"}
                    </button>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                        <span className="text-gray-600">Result:</span>
                        <span className="text-xl font-bold text-green-600">{result !== null ? `${result} g/mol` : "--"}</span>
                    </div>
                </div>
            </div>
        </>
    )
}
