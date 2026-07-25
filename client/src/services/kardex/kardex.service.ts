import { api } from "@/services/api";
import type { ApiResponse, KardexMovement } from "@/types";

export async function getKardex(
    productId: string,
    storeId: string
): Promise<ApiResponse<KardexMovement[]>> {

    const { data } = await api.get<ApiResponse<KardexMovement[]>>(
        `/inventory-movements/kardex/${productId}/${storeId}`
    );

    return data;

}