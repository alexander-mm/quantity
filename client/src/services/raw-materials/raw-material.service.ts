import { api } from "@/services/api";
import type { ApiResponse, RawMaterial, RawMaterialShape, TubeProfile } from "@/types";

export async function getRawMaterials(): Promise<ApiResponse<RawMaterial[]>> {
    const { data } = await api.get<ApiResponse<RawMaterial[]>>("/raw-materials");
    return data;
}

export async function getLowStockRawMaterials(): Promise<ApiResponse<RawMaterial[]>> {
    const { data } = await api.get<ApiResponse<RawMaterial[]>>("/raw-materials/low-stock");
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
    minimumStock?: number;
    initialQuantity?: number;
    cost?: number;
    wastePercentage?: number;
    laserCostPerMeter?: number;
    mechanicalCutCost?: number;
    bendCostPerBend?: number;
    curveCostPerCurve?: number;
};

export async function createRawMaterial(payload: CreateRawMaterialRequest): Promise<ApiResponse<RawMaterial>> {
    const { data } = await api.post<ApiResponse<RawMaterial>>("/raw-materials", payload);
    return data;
}

export async function updateRawMaterial(id: string, payload: CreateRawMaterialRequest): Promise<ApiResponse<RawMaterial>> {
    const { data } = await api.put<ApiResponse<RawMaterial>>(`/raw-materials/${id}`, payload);
    return data;
}

export async function updateRawMaterialMinimumStock(id: string, minimumStock: number): Promise<ApiResponse<RawMaterial>> {
    const { data } = await api.patch<ApiResponse<RawMaterial>>(`/raw-materials/${id}/minimum-stock`, { minimumStock });
    return data;
}

export async function deleteRawMaterial(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/raw-materials/${id}`);
    return data;
}
