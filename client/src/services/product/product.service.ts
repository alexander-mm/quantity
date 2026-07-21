import { api } from "@/services/api";

import type {

    ApiResponse,

    Product

} from "@/types";

export async function getProducts(): Promise<ApiResponse<Product[]>> {

    const { data } = await api.get<ApiResponse<Product[]>>("/products");

    return data;

}