export interface CreateRawMaterialAdjustmentDto {
    number: string;
    rawMaterialId: string;
    userId: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
}
