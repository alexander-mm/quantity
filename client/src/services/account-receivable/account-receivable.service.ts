import { api } from "@/services/api";
import type { ApiResponse, AccountReceivable, WholesalerCreditSummary } from "@/types";

export async function getAccountsReceivable(): Promise<ApiResponse<AccountReceivable[]>> {
    const { data } = await api.get<ApiResponse<AccountReceivable[]>>("/accounts-receivable");
    return data;
}

export async function getAccountsReceivableByClient(
    clientId: string
): Promise<ApiResponse<AccountReceivable[]>> {
    const { data } = await api.get<ApiResponse<AccountReceivable[]>>(
        `/accounts-receivable/by-client/${clientId}`
    );
    return data;
}

export async function getAccountReceivableById(id: string): Promise<ApiResponse<AccountReceivable>> {
    const { data } = await api.get<ApiResponse<AccountReceivable>>(`/accounts-receivable/${id}`);
    return data;
}

export async function getWholesalerCreditSummary(): Promise<ApiResponse<WholesalerCreditSummary[]>> {
    const { data } = await api.get<ApiResponse<WholesalerCreditSummary[]>>("/accounts-receivable/summary");
    return data;
}

export type UpdateAccountReceivableRequest = {
    number: string;
    observations?: string;
};

export async function updateAccountReceivable(
    id: string,
    payload: UpdateAccountReceivableRequest
): Promise<ApiResponse<AccountReceivable>> {
    const { data } = await api.put<ApiResponse<AccountReceivable>>(`/accounts-receivable/${id}`, payload);
    return data;
}

export async function markAccountReceivablePaid(id: string): Promise<ApiResponse<AccountReceivable>> {
    const { data } = await api.post<ApiResponse<AccountReceivable>>(`/accounts-receivable/${id}/mark-paid`);
    return data;
}
