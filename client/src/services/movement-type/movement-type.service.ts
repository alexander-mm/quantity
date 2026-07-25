import { api } from "@/services/api";
import type { ApiResponse, MovementType } from "@/types";

export async function getMovementTypes(): Promise<ApiResponse<MovementType[]>> {
    const { data } = await api.get<ApiResponse<MovementType[]>>("/movement-types");
    return data;
}