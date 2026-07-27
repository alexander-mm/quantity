import { api } from "@/services/api";
import type { ApiResponse, InventoryAdjustment } from "@/types";

export async function getInventoryAdjustments():
    Promise<ApiResponse<InventoryAdjustment[]>> {
    const { data } = await api.get<
        ApiResponse<InventoryAdjustment[]>
    >("/inventory-adjustments");
    return data;
}

export type CreateInventoryAdjustmentRequest = {
    productId: string;
    storeId: string;
    userId: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
};

export async function createInventoryAdjustment(
    payload: CreateInventoryAdjustmentRequest
): Promise<ApiResponse<InventoryAdjustment>> {
    const { data } = await api.post<
        ApiResponse<InventoryAdjustment>
    >(
        "/inventory-adjustments",
        payload
    );
    return data;
}