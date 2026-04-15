
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
        <div className=" mt-2 flex flex-col sm:flex-row gap-2">
            <select name="elements"
            value={row.element}
            onChange={(e)=> onChange(index, "element", e.target.value)}
            className="bg-blue-200 px-4 py-2 rounded-lg border border-gray-500 w-fit sm:w-full">
                <option value="H" className="w">H</option>
                <option value="O">O</option>
                <option value="Na">Na</option>
                <option value="Cl">Cl</option>
            </select>
            <input 
            type="number" 
            value={row.quantity}
            onChange={(e)=> onChange(index, "quantity", Number(e.target.value))}
            placeholder="Enter quantity" 
            className="px-4 py-2 border rounded-2xl w-full" 
            />
            <button onClick={()=>onRemove(index)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition ml-2 w-full sm:w-auto cursor-pointer">Remove</button>
        </div>
    )
}
