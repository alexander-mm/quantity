import { api } from "@/services/api";
import type { ApiResponse, PartCuttingOrder } from "@/types";

export async function getPartCuttingOrders(): Promise<ApiResponse<PartCuttingOrder[]>> {
    const { data } = await api.get<ApiResponse<PartCuttingOrder[]>>("/part-cutting-orders");
    return data;
}

export async function getPartCuttingOrderById(id: string): Promise<ApiResponse<PartCuttingOrder>> {
    const { data } = await api.get<ApiResponse<PartCuttingOrder>>(`/part-cutting-orders/${id}`);
    return data;
}

export type CreatePartCuttingOrderRequest = {
    number: string;
    partId: string;
    rawMaterialQtyUsed: number;
    observations?: string;
};

export type UpdatePartCuttingOrderRequest = CreatePartCuttingOrderRequest;

export async function createPartCuttingOrder(
    payload: CreatePartCuttingOrderRequest
): Promise<ApiResponse<PartCuttingOrder>> {
    const { data } = await api.post<ApiResponse<PartCuttingOrder>>("/part-cutting-orders", payload);
    return data;
}

export async function updatePartCuttingOrder(
    id: string,
    payload: UpdatePartCuttingOrderRequest
): Promise<ApiResponse<PartCuttingOrder>> {
    const { data } = await api.put<ApiResponse<PartCuttingOrder>>(`/part-cutting-orders/${id}`, payload);
    return data;
}

export type ConfirmPartCuttingOrderRequest = {
    goodPieces: number;
    defectivePieces?: number;
};

export async function confirmPartCuttingOrder(
    id: string,
    payload: ConfirmPartCuttingOrderRequest
): Promise<ApiResponse<PartCuttingOrder>> {
    const { data } = await api.post<ApiResponse<PartCuttingOrder>>(`/part-cutting-orders/${id}/confirm`, payload);
    return data;
}

export async function deletePartCuttingOrder(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/part-cutting-orders/${id}`);
    return data;
}
