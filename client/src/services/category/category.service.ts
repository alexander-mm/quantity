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