import { useState } from "react";
import atomicMass from "../../data/atomicMass";
import { sounds } from "../../utils/sound";

type Row = {
    element: string;
    quantity: number;
};

type Props = {
    index: number;
    row: Row;
    onRemove: (index: number) => void;
    onChange: (index: number, field: keyof Row, value: string | number) => void;
};

export default function ElementRow({index, row, onRemove, onChange}: Props) {
    const [search, setSearch] = useState("")

    const filteredElements = Object.keys(atomicMass).filter((el)=>(
        el.toLocaleLowerCase().includes(search.toLowerCase())
    ))

    return (
        <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-xl">
            <input
            value={search}
            onChange={(e)=> setSearch(e.target.value)}
            placeholder="Search element (e.g. Na)"
            className="px-3 py-2 border rounded-lg"
            />

            <div className="max-h-40 overflow-y-auto border rounded-lg mt-1">
                {filteredElements.map((el) => (
                    <div 
                    key={el}
                    onClick={() => {onChange(index, "element", el)
                        setSearch(el)
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >  
                        {el}
                    </div>
                ))}
            </div>

            <input 
            type="number" 
            value={row.quantity}
            onChange={(e)=> onChange(index, "quantity", Number(e.target.value))}
            placeholder="Enter quantity" 
            className="px-3 py-2 border border-gray-300 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1" 
            />
            <button 
            onClick={()=>
            {
                sounds.click()
                onRemove(index)
            }} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition w-full cursor-pointer text-sm sm:text-base"
            > Remove
            </button>
        </div>
    )
}
