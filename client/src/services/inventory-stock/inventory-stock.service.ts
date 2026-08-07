import { api } from "@/services/api";
import type { ApiResponse, InventoryStock } from "@/types";

export async function getInventoryStock(): Promise<ApiResponse<InventoryStock[]>> {
    const { data } = await api.get<ApiResponse<InventoryStock[]>>("/inventory-stock");
    return data;
}

export async function getLowStock(): Promise<ApiResponse<InventoryStock[]>> {
    const { data } = await api.get<ApiResponse<InventoryStock[]>>("/inventory-stock/low-stock");
    return data;
}

export async function getInventoryStockByProduct(productId: string): Promise<ApiResponse<InventoryStock[]>> {
    const { data } = await api.get<ApiResponse<InventoryStock[]>>(`/inventory-stock/product/${productId}`);
    return data;
}