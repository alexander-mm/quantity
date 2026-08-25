export interface DamagedPart {
    id: string;
    quantity: string;
    part: {
        id: string;
        code: string;
        name: string;
    };
}
