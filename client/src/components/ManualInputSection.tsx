import type { Row } from "../types";
import ElementRow from "./ElementRow";


type Props = {
  rows: Row[];
  addRow: () => void;
  handleChange: (
    index: number,
    field: keyof Row,
    value: string | number
  ) => void;
  handleRemove: (index: number) => void;
};

export default function ManualInputSection({
    rows,
    addRow,
    handleChange,
    handleRemove,
    }: Props) {
    return (
        <>
        {rows.length === 0 && <p>No elements added</p>}

        <button onClick={addRow}>+ Add Element</button>

        {rows.map((row, index) => (
            <ElementRow
            key={index}
            index={index}
            row={row}
            onRemove={handleRemove}
            onChange={handleChange}
            />
        ))}
        </>
    );
}