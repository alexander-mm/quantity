import { api } from "@/services/api";
import type { ApiResponse, PartAssembly, PartAssemblyPreview } from "@/types";

export async function getPartAssemblies(): Promise<ApiResponse<PartAssembly[]>> {
    const { data } = await api.get<ApiResponse<PartAssembly[]>>("/part-assemblies");
    return data;
}

export async function getPartAssemblyById(id: string): Promise<ApiResponse<PartAssembly>> {
    const { data } = await api.get<ApiResponse<PartAssembly>>(`/part-assemblies/${id}`);
    return data;
}

export async function getPartAssemblyPreview(
    partId: string,
    quantity: number
): Promise<ApiResponse<PartAssemblyPreview>> {
    const { data } = await api.get<ApiResponse<PartAssemblyPreview>>(
        `/part-assemblies/preview/${partId}`,
        { params: { quantity } }
    );
    return data;
}

export type CreatePartAssemblyRequest = {
    number: string;
    partId: string;
    quantity: number;
    observations?: string;
};

export type UpdatePartAssemblyRequest = CreatePartAssemblyRequest;

export async function createPartAssembly(
    payload: CreatePartAssemblyRequest
): Promise<ApiResponse<PartAssembly>> {
    const { data } = await api.post<ApiResponse<PartAssembly>>("/part-assemblies", payload);
    return data;
}

export async function updatePartAssembly(
    id: string,
    payload: UpdatePartAssemblyRequest
): Promise<ApiResponse<PartAssembly>> {
    const { data } = await api.put<ApiResponse<PartAssembly>>(`/part-assemblies/${id}`, payload);
    return data;
}

export async function confirmPartAssembly(id: string): Promise<ApiResponse<PartAssembly>> {
    const { data } = await api.post<ApiResponse<PartAssembly>>(`/part-assemblies/${id}/confirm`);
    return data;
}

export async function deletePartAssembly(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/part-assemblies/${id}`);
    return data;
}