import { api } from "@/services/api";
import type { ApiResponse, AccountReceivable, AccountReceivableSummary } from "@/types";

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

export async function getAccountReceivableSummary(): Promise<ApiResponse<AccountReceivableSummary[]>> {
    const { data } = await api.get<ApiResponse<AccountReceivableSummary[]>>("/accounts-receivable/summary");
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

export type CreateAccountReceivablePaymentRequest = {
    amount: number;
    paymentMethods: { method: "CASH" | "TRANSFER"; amount: number }[];
    paymentDate: Date;
    vouchers?: string[];
    observations?: string;
};

export async function createAccountReceivablePayment(
    id: string,
    payload: CreateAccountReceivablePaymentRequest
): Promise<ApiResponse<AccountReceivable>> {
    const { data } = await api.post<ApiResponse<AccountReceivable>>(
        `/accounts-receivable/${id}/payments`,
        payload
    );
    return data;
}
