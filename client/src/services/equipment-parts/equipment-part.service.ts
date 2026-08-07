import { api } from "@/services/api";
import type { ApiResponse, EquipmentPart, EquipmentPartPreview } from "@/types";

export async function getEquipmentParts(productId: string): Promise<ApiResponse<EquipmentPart[]>> {
    const { data } = await api.get<ApiResponse<EquipmentPart[]>>(`/equipment-parts/${productId}`);
    return data;
}

export async function getEquipmentPartPreview(
    productId: string,
    quantity: number
): Promise<ApiResponse<EquipmentPartPreview>> {
    const { data } = await api.get<ApiResponse<EquipmentPartPreview>>(
        `/equipment-parts/preview/${productId}`,
        { params: { quantity } }
    );
    return data;
}

export type SetEquipmentPartsRequest = {
    parts: {
        partId: string;
        quantity: number;
    }[];
};

export async function setEquipmentParts(
    productId: string,
    payload: SetEquipmentPartsRequest
): Promise<ApiResponse<EquipmentPart[]>> {
    const { data } = await api.put<ApiResponse<EquipmentPart[]>>(
        `/equipment-parts/${productId}`,
        payload
    );
    return data;
}
