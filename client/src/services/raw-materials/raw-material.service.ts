import { api } from "@/services/api";
import type { ApiResponse, RawMaterial, RawMaterialShape, TubeProfile } from "@/types";

export async function getRawMaterials(): Promise<ApiResponse<RawMaterial[]>> {
    const { data } = await api.get<ApiResponse<RawMaterial[]>>("/raw-materials");
    return data;
}

export async function getRawMaterialById(id: string): Promise<ApiResponse<RawMaterial>> {
    const { data } = await api.get<ApiResponse<RawMaterial>>(`/raw-materials/${id}`);
    return data;
}

export type CreateRawMaterialRequest = {
    code: string;
    name: string;
    shape: RawMaterialShape;
    material: string;
    thickness: number;
    width?: number;
    height?: number;
    length?: number;
    profile?: TubeProfile;
    initialQuantity?: number;
};

export async function createRawMaterial(payload: CreateRawMaterialRequest): Promise<ApiResponse<RawMaterial>> {
    const { data } = await api.post<ApiResponse<RawMaterial>>("/raw-materials", payload);
    return data;
}

export async function updateRawMaterial(id: string, payload: CreateRawMaterialRequest): Promise<ApiResponse<RawMaterial>> {
    const { data } = await api.put<ApiResponse<RawMaterial>>(`/raw-materials/${id}`, payload);
    return data;
}

export async function deleteRawMaterial(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/raw-materials/${id}`);
    return data;
}
