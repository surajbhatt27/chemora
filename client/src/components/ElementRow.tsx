
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
    return (
        <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-xl">
            <select name="elements"
            value={row.element}
            onChange={(e)=> onChange(index, "element", e.target.value)}
            className="bg-blue-50 px-3 py-2 rounded-lg border border-gray-300 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select</option>
                <option value="H">H</option>
                <option value="O">O</option>
                <option value="Na">Na</option>
                <option value="Cl">Cl</option>
            </select>
            <input 
            type="number" 
            value={row.quantity}
            onChange={(e)=> onChange(index, "quantity", Number(e.target.value))}
            placeholder="Enter quantity" 
            className="px-3 py-2 border border-gray-300 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1" 
            />
            <button onClick={()=>onRemove(index)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition w-full cursor-pointer text-sm sm:text-base">Remove</button>
        </div>
    )
}
