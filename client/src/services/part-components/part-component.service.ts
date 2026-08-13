import { api } from "@/services/api";
import type { ApiResponse, PartComponent } from "@/types";

export async function getPartComponents(partId: string): Promise<ApiResponse<PartComponent[]>> {
    const { data } = await api.get<ApiResponse<PartComponent[]>>(`/part-components/${partId}`);
    return data;
}

export async function getPartIdsWithRecipe(): Promise<ApiResponse<string[]>> {
    const { data } = await api.get<ApiResponse<string[]>>("/part-components/with-recipe");
    return data;
}

export type SetPartComponentsRequest = {
    components: {
        componentPartId: string;
        quantity: number;
    }[];
};

export async function setPartComponents(
    partId: string,
    payload: SetPartComponentsRequest
): Promise<ApiResponse<PartComponent[]>> {
    const { data } = await api.put<ApiResponse<PartComponent[]>>(
        `/part-components/${partId}`,
        payload
    );
    return data;
}