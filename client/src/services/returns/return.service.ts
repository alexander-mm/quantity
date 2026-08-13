import { api } from "@/services/api";
import type { ApiResponse, Return, ReturnReason, ReturnDisposition } from "@/types";

export async function getReturns(): Promise<ApiResponse<Return[]>> {
    const { data } = await api.get<ApiResponse<Return[]>>("/returns");
    return data;
}

export async function getReturnById(id: string): Promise<ApiResponse<Return>> {
    const { data } = await api.get<ApiResponse<Return>>(`/returns/${id}`);
    return data;
}

export type CreateReturnRequest = {
    number: string;
    saleId?: string;
    saleDetailId?: string;
    productId: string;
    storeId: string;
    quantity: number;
    reason: ReturnReason;
    notes?: string;
    returnDate: Date;
    disposition?: ReturnDisposition;
};

export async function createReturn(payload: CreateReturnRequest): Promise<ApiResponse<Return>> {
    const { data } = await api.post<ApiResponse<Return>>("/returns", payload);
    return data;
}

export async function resolveReturn(
    id: string,
    disposition: ReturnDisposition
): Promise<ApiResponse<Return>> {
    const { data } = await api.post<ApiResponse<Return>>(`/returns/${id}/resolve`, { disposition });
    return data;
}
