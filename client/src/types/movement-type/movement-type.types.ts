export interface MovementType {
    id: string;
    name: string;
    stockOperation: "IN" | "OUT" | "NONE";
}