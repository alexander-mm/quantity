import { api } from "@/services/api";
import type { ApiResponse, DamagedPart } from "@/types";

export async function getDamagedParts(): Promise<ApiResponse<DamagedPart[]>> {
    const { data } = await api.get<ApiResponse<DamagedPart[]>>("/damaged-parts");
    return data;
}
