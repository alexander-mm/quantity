import { api } from "@/services/api";
import type { ApiResponse, Brand } from "@/types";

export async function getBrands(): Promise<ApiResponse<Brand[]>> {
    const { data } = await api.get<ApiResponse<Brand[]>>("/brands");
    return data;
}

export type CreateBrandRequest = { name: string; description?: string };

export async function createBrand(payload: CreateBrandRequest): Promise<ApiResponse<Brand>> {
    const { data } = await api.post<ApiResponse<Brand>>("/brands", payload);
    return data;
}

export async function deleteBrand(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/brands/${id}`);
    return data;
}