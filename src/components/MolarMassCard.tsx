import { useState } from "react";
import ElementRow from "./ElementRow";

export default function MolarMassCard() {

    type Row = {
        element: string;
        quantity: number;
    };

    const atomicMass: Record<string, number> = {
        H: 1,
        O: 16,
        Na: 23,
        Cl: 35.5
    }

    const [result, setResult] = useState<number |null>(null)
    const [formula, setFormula] = useState<string>("")

    const calculateMass = () => {
        let total = 0;

        for(const row of rows) {
            if (!atomicMass[row.element]) return;
            const mass = atomicMass[row.element]
            total += mass * row.quantity
        }
        setResult(total)
    }

    const [rows, setRows] = useState<Row[]>([
        { element : "H", quantity: 1}
    ])

    const addRow = ()=> {
        setRows ([...rows, {element:"H", quantity: 1}])
    }

    const handleRemove = (indexToRemove: number)=> {
        const updateRows = rows.filter((_, index) => index !== indexToRemove)
        setRows(updateRows)
    }

    const handleChange = (index: number, field: keyof Row, value: string|number) => {
        const updatedRows = [...rows]
        updatedRows[index][field] = value as never;
        setRows(updatedRows)
    }

    const parseFormula = (formula: string) => {
        const result: {element: string, quantity: number}[] = []
        let i=0
        while(i<formula.length) {
            let element = formula[i]
            if(i+1 < formula.length && formula[i+1].match(/[a-z]/)) {
                element += formula[i+1]
                i++
            }
            i++;

            let numStr =""
            while(i<formula.length && formula[i].match(/[0-9]/)) {
                numStr += formula[i]
                i++
            }

            const quantity = numStr ? parseInt(numStr): 1;
            result.push({element, quantity})
        }
        return result
    }

    const handleparse = ()=> {
        if(!formula) return;
        const parsed = parseFormula(formula)
        setRows(parsed)
        setResult(null)
    }

    return (
        <div className="p-4 sm:p-6 bg-white shadow-xl mt-4 sm:mt-6 w-full max-w-lg mx-auto rounded-2xl border">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Molar Mass Calculator</h2>
            <div className="flex flex-col gap-2 mb-4 w-full">
            <input 
            type="text"
            value={formula}
            onChange={(e)=> setFormula(e.target.value)} 
            placeholder="Enter formula" 
            className="px-4 py-2 border rounded-xl" />
            <button 
            onClick={handleparse}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition cursor-pointer w-full sm:w-auto text-sm sm:text-base">Parse</button>
            </div>
            <button onClick={addRow} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition w-full mb-3 cursor-pointer text-sm sm:text-base">add element</button>
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
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 p-3 bg-gray-100 rounded-xl">
                <button onClick={calculateMass} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition cursor-pointer text-sm sm:text-base">Calculate</button>
                <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span className="text-gray-600">Result:</span>
                    <span className="text-xl font-bold text-green-600">{result !== null ? `${result} g/mol` : "--"}</span>
                </div>
            </div>
        </div>
    )
}
