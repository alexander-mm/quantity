import { api } from "@/services/api";
import type { ApiResponse, ProductComponent } from "@/types";

export async function getProductComponents(productId: string): Promise<ApiResponse<ProductComponent[]>> {
    const { data } = await api.get<ApiResponse<ProductComponent[]>>(`/product-components/${productId}`);
    return data;
}

export async function getProductIdsWithRecipe(): Promise<ApiResponse<string[]>> {
    const { data } = await api.get<ApiResponse<string[]>>("/product-components/with-recipe");
    return data;
}

export type SetProductComponentsRequest = {
    components: {
        componentProductId: string;
        quantity: number;
    }[];
};

export async function setProductComponents(
    productId: string,
    payload: SetProductComponentsRequest
): Promise<ApiResponse<ProductComponent[]>> {
    const { data } = await api.put<ApiResponse<ProductComponent[]>>(
        `/product-components/${productId}`,
        payload
    );
    return data;
}
