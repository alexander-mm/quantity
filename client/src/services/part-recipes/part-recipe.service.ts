import { api } from "@/services/api";
import type { ApiResponse, PartRecipe } from "@/types";

export async function getPartRecipeByPart(partId: string): Promise<ApiResponse<PartRecipe | null>> {
    const { data } = await api.get<ApiResponse<PartRecipe | null>>(`/part-recipes/${partId}`);
    return data;
}

export type SetPartRecipeRequest = {
    rawMaterialId: string;
    pieceWidth?: number;
    pieceHeight?: number;
    pieceLength?: number;
    piecesPerUnit?: number;
    laserMeters?: number;
    usesMechanicalCut?: boolean;
    bendCount?: number;
    curveCount?: number;
};

export async function setPartRecipe(
    partId: string,
    payload: SetPartRecipeRequest
): Promise<ApiResponse<PartRecipe>> {
    const { data } = await api.put<ApiResponse<PartRecipe>>(`/part-recipes/${partId}`, payload);
    return data;
}

export async function deletePartRecipe(partId: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete<ApiResponse<null>>(`/part-recipes/${partId}`);
    return data;
}
