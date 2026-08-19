import { api } from "@/services/api";
import type { ApiResponse, PartCategory } from "@/types";

export async function getPartCategories(): Promise<ApiResponse<PartCategory[]>> {
    const { data } = await api.get<ApiResponse<PartCategory[]>>("/part-categories");
    return data;
}

export type CreatePartCategoryRequest = { name: string; description?: string };

export async function createPartCategory(payload: CreatePartCategoryRequest): Promise<ApiResponse<PartCategory>> {
    const { data } = await api.post<ApiResponse<PartCategory>>("/part-categories", payload);
    return data;
}

export async function deletePartCategory(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/part-categories/${id}`);
    return data;
}
