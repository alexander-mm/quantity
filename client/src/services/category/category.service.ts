import { api } from "@/services/api";

import type {

    ApiResponse,

    Category

} from "@/types";

export async function getCategories(): Promise<ApiResponse<Category[]>> {

    const { data } = await api.get<ApiResponse<Category[]>>("/categories");

    return data;

}

export type CreateCategoryRequest = {
    name: string;
    description?: string;
    stockMultiplier?: number;
};

export async function createCategory(
    payload: CreateCategoryRequest
): Promise<ApiResponse<Category>> {
    const { data } = await api.post<ApiResponse<Category>>(
        "/categories",
        payload
    );
    return data;
}

export async function getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return data;
}

export async function updateCategory(
    id: string,
    payload: CreateCategoryRequest
): Promise<ApiResponse<Category>> {
    const { data } = await api.put<ApiResponse<Category>>(
        `/categories/${id}`,
        payload
    );
    return data;
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/categories/${id}`);
    return data;
}