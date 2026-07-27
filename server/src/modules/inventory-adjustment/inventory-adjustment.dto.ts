export interface CreateInventoryAdjustmentDto {
    productId: string;
    storeId: string;
    userId: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
}
