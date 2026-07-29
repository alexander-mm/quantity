import { api } from "@/services/api";
import type { ApiResponse, Role } from "@/types";

export async function getRoles(): Promise<ApiResponse<Role[]>> {
    const { data } = await api.get<ApiResponse<Role[]>>("/roles");
    return data;
}
