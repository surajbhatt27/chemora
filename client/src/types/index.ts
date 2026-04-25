export type Token = {
    type: string;
    value: string;
};

export type Row = {
    element: string;
    quantity: number;
};

export type Interpretation = {
    tokens: Token[];
    rows: Row[];
    label: string;
    originalIndex: number;
};