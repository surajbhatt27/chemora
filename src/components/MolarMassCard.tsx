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
    return (
        <div className="p-6 bg-white shadow-xl mt-6 sm:mt-10 w-full max-w-lg mx-auto rounded-2xl border">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Molar Mass Calculator</h2>
            <button onClick={addRow} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition w-full sm:w-auto cursor-pointer">add element</button>
            {rows.map((row, index)=>(
                <ElementRow 
                key={index}
                index={index}
                row={row}
                onRemove={handleRemove}
                onChange={handleChange}
                />
            ))}
            <div className="flex items-center justify-between gap-2 mt-4 p-3 bg-gray-100 rounded-xl">
                <button onClick={calculateMass} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition cursor-pointer">Calculate</button>
                <span className="text-gray-600">Result:</span>
                <span className="text-xl font-bold text-green-600">{result !== null ? `${result} g/mol` : "--"}</span>
            </div>
        </div>
    )
}
