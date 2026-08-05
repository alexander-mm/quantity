import { api } from "@/services/api";
import type { ApiResponse, Client } from "@/types";

export async function getClients():
    Promise<ApiResponse<Client[]>>{

    const {data}=await api.get<
        ApiResponse<Client[]>
    >("/clients");

    return data;

}

export async function getClientById(id: string): Promise<ApiResponse<Client>> {
    const { data } = await api.get<ApiResponse<Client>>(`/clients/${id}`);
    return data;
}

export type CreateClientRequest = {
    document: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    phone?: string;
    email?: string;
    address?: string;
    discountPercentage?: number;
    isWholesaler?: boolean;
    usesCredit?: boolean;
    currency?: "USD" | "COP";
};

export async function createClient(
    payload: CreateClientRequest
): Promise<ApiResponse<Client>> {
    const { data } = await api.post<ApiResponse<Client>>("/clients", payload);
    return data;
}

export async function updateClient(
    id: string,
    payload: CreateClientRequest
): Promise<ApiResponse<Client>> {
    const { data } = await api.put<ApiResponse<Client>>(`/clients/${id}`, payload);
    return data;
}

export async function deleteClient(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/clients/${id}`);
    return data;
}
