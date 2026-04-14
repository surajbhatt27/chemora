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
        <div className="card p-5 bg-red-200 mt-5 w-1/3 mx-auto rounded-2xl">
            <button onClick={addRow} className="btn bg-sky-500 p-2 rounded-2xl">add element</button>
            {rows.map((row, index)=>(
                <ElementRow 
                key={index}
                index={index}
                row={row}
                onRemove={handleRemove}
                onChange={handleChange}
                />
            ))}
            <div className="flex items-center gap-2 mt-2">
                <button onClick={calculateMass} className="btn bg-sky-500 p-2 rounded-2xl">Calculate</button>
                <span className="text-2xl text-green-700">{result !== null? result : '-'}</span>
                <span className="text-sm">g/mol</span>
            </div>
        </div>
    )
}
