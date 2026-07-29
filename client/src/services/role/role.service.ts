import { api } from "@/services/api";
import type { ApiResponse, Role } from "@/types";

export async function getRoles(): Promise<ApiResponse<Role[]>> {
    const { data } = await api.get<ApiResponse<Role[]>>("/roles");
    return data;
}

export async function getRoleById(id: string): Promise<ApiResponse<Role>> {
    const { data } = await api.get<ApiResponse<Role>>(`/roles/${id}`);
    return data;
}

export type CreateRoleRequest = {
    name: string;
    description?: string;
};

export async function createRole(payload: CreateRoleRequest): Promise<ApiResponse<Role>> {
    const { data } = await api.post<ApiResponse<Role>>("/roles", payload);
    return data;
}

export async function updateRole(id: string, payload: CreateRoleRequest): Promise<ApiResponse<Role>> {
    const { data } = await api.put<ApiResponse<Role>>(`/roles/${id}`, payload);
    return data;
}

export async function deleteRole(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/roles/${id}`);
    return data;
}