import { api } from "@/services/api";
import type { ApiResponse, PartComponentProduct } from "@/types";

export async function getPartComponentProducts(partId: string): Promise<ApiResponse<PartComponentProduct[]>> {
    const { data } = await api.get<ApiResponse<PartComponentProduct[]>>(`/part-component-products/${partId}`);
    return data;
}

export type SetPartComponentProductsRequest = {
    products: {
        componentProductId: string;
        quantity: number;
    }[];
};

export async function setPartComponentProducts(
    partId: string,
    payload: SetPartComponentProductsRequest
): Promise<ApiResponse<PartComponentProduct[]>> {
    const { data } = await api.put<ApiResponse<PartComponentProduct[]>>(
        `/part-component-products/${partId}`,
        payload
    );
    return data;
}