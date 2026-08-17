import { api } from "@/services/api";
import type { ApiResponse, StockTransfer } from "@/types";

export async function getStockTransfers(): Promise<ApiResponse<StockTransfer[]>> {
    const { data } = await api.get<ApiResponse<StockTransfer[]>>("/stock-transfers");
    return data;
}

export async function getStockTransferById(id: string): Promise<ApiResponse<StockTransfer>> {
    const { data } = await api.get<ApiResponse<StockTransfer>>(`/stock-transfers/${id}`);
    return data;
}

export type CreateStockTransferRequest = {
    number: string;
    originStoreId: string;
    destType: "STORE" | "TECHNICIAN";
    destStoreId?: string;
    destUserId?: string;
    dispatchDate: string;
    observations?: string;
    details: { productId: string; quantitySent: number; }[];
};

export async function createStockTransfer(
    payload: CreateStockTransferRequest
): Promise<ApiResponse<StockTransfer>> {
    const { data } = await api.post<ApiResponse<StockTransfer>>("/stock-transfers", payload);
    return data;
}

export type UpdateStockTransferRequest = CreateStockTransferRequest;

export async function updateStockTransfer(
    id: string,
    payload: UpdateStockTransferRequest
): Promise<ApiResponse<StockTransfer>> {
    const { data } = await api.put<ApiResponse<StockTransfer>>(`/stock-transfers/${id}`, payload);
    return data;
}

export async function dispatchStockTransfer(id: string): Promise<ApiResponse<StockTransfer>> {
    const { data } = await api.post<ApiResponse<StockTransfer>>(`/stock-transfers/${id}/dispatch`);
    return data;
}

export async function confirmStockTransfer(id: string): Promise<ApiResponse<StockTransfer>> {
    const { data } = await api.post<ApiResponse<StockTransfer>>(`/stock-transfers/${id}/confirm`);
    return data;
}

export type ReportIssueRequest = {
    observations: string;
    details: { productId: string; quantityReceived: number; }[];
};

export async function reportStockTransferIssue(
    id: string,
    payload: ReportIssueRequest
): Promise<ApiResponse<StockTransfer>> {
    const { data } = await api.post<ApiResponse<StockTransfer>>(`/stock-transfers/${id}/report-issue`, payload);
    return data;
}

export type ResolveStockTransferRequest = {
    details: { productId: string; quantityReceived: number; }[];
};

export async function resolveStockTransfer(
    id: string,
    payload: ResolveStockTransferRequest
): Promise<ApiResponse<StockTransfer>> {
    const { data } = await api.post<ApiResponse<StockTransfer>>(`/stock-transfers/${id}/resolve`, payload);
    return data;
}
