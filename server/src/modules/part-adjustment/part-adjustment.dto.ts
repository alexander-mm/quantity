export interface CreatePartAdjustmentDto {
    number: string;
    partId: string;
    userId: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
}
