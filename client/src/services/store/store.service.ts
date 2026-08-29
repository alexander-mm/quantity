import { api } from "@/services/api";
import type { ApiResponse, Store } from "@/types";

export async function getStores(): Promise<ApiResponse<Store[]>> {
    const { data } = await api.get<ApiResponse<Store[]>>("/stores");
    return data;
}

export async function getStoreById(id: string): Promise<ApiResponse<Store>> {
    const { data } = await api.get<ApiResponse<Store>>(`/stores/${id}`);
    return data;
}

export type CreateStoreRequest = {
    code: string;
    name: string;
    type: "MAIN_WAREHOUSE" | "STORE";
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    manager?: string;
    attendanceIp?: string;
};

export async function createStore(
    payload: CreateStoreRequest
): Promise<ApiResponse<Store>> {
    const { data } = await api.post<ApiResponse<Store>>("/stores", payload);
    return data;
}

export async function updateStore(
    id: string,
    payload: CreateStoreRequest
): Promise<ApiResponse<Store>> {
    const { data } = await api.put<ApiResponse<Store>>(`/stores/${id}`, payload);
    return data;
}

export async function deleteStore(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/stores/${id}`);
    return data;
}
