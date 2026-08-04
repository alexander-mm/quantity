import { api } from "@/services/api";
import type { ApiResponse, Part } from "@/types";

export async function getParts(): Promise<ApiResponse<Part[]>> {
    const { data } = await api.get<ApiResponse<Part[]>>("/parts");
    return data;
}

export async function getPartById(id: string): Promise<ApiResponse<Part>> {
    const { data } = await api.get<ApiResponse<Part>>(`/parts/${id}`);
    return data;
}

export type CreatePartRequest = {
    code: string;
    name: string;
    description?: string;
    initialQuantity?: number;
};

export async function createPart(payload: CreatePartRequest): Promise<ApiResponse<Part>> {
    const { data } = await api.post<ApiResponse<Part>>("/parts", payload);
    return data;
}

export async function updatePart(id: string, payload: CreatePartRequest): Promise<ApiResponse<Part>> {
    const { data } = await api.put<ApiResponse<Part>>(`/parts/${id}`, payload);
    return data;
}

export async function deletePart(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/parts/${id}`);
    return data;
}
