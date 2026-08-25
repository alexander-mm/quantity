import { api } from "@/services/api";
import type { ApiResponse, DamagedStock } from "@/types";

export async function getDamagedStock(): Promise<ApiResponse<DamagedStock[]>> {
    const { data } = await api.get<ApiResponse<DamagedStock[]>>("/damaged-stock");
    return data;
}
