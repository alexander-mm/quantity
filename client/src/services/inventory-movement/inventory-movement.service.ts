import { api } from "@/services/api";
import type { ApiResponse, InventoryMovement } from "@/types";

export async function getInventoryMovements():
    Promise<ApiResponse<InventoryMovement[]>> {
    const { data } = await api.get<
        ApiResponse<InventoryMovement[]>
    >("/inventory-movements");
    return data;
}

export async function getInventoryMovementById(
    id: string
): Promise<ApiResponse<InventoryMovement>> {
    const { data } = await api.get<
        ApiResponse<InventoryMovement>
    >(`/inventory-movements/${id}`);
    return data;
}

export type CreateInventoryMovementRequest = {
    movementTypeId: string;
    productId: string;
    storeId: string;
    userId: string;
    clientId?: string;
    quantity: number;
    unitCost: number;
    observations?: string;
    movementDate: Date;
};

export async function createInventoryMovement(
    payload: CreateInventoryMovementRequest
): Promise<ApiResponse<InventoryMovement>> {
    const { data } = await api.post<
        ApiResponse<InventoryMovement>
    >(
        "/inventory-movements",
        payload
    );
    return data;
}