import { api } from "@/services/api";
import type { ApiResponse, Store } from "@/types";

export async function getStores(): Promise<ApiResponse<Store[]>> {
    const { data } = await api.get<ApiResponse<Store[]>>("/stores");
    return data;
}