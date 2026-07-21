import { api } from "@/services/api";

import type {

    ApiResponse,

    Category

} from "@/types";

export async function getCategories(): Promise<ApiResponse<Category[]>> {

    const { data } = await api.get<ApiResponse<Category[]>>("/categories");

    return data;

}