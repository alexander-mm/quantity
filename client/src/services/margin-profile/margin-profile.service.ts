import { api } from "@/services/api";

import type {

    ApiResponse,

    MarginProfile

} from "@/types";

export async function getMarginProfiles(): Promise<ApiResponse<MarginProfile[]>> {

    const { data } = await api.get<ApiResponse<MarginProfile[]>>("/margin-profiles");

    return data;

}

export type CreateMarginProfileRequest = {
    name: string;
    percentage: number;
    displayOrder: number;
};

export async function createMarginProfile(
    payload: CreateMarginProfileRequest
): Promise<ApiResponse<MarginProfile>> {
    const { data } = await api.post<ApiResponse<MarginProfile>>(
        "/margin-profiles",
        payload
    );
    return data;
}

export async function getMarginProfileById(id: string): Promise<ApiResponse<MarginProfile>> {
    const { data } = await api.get<ApiResponse<MarginProfile>>(`/margin-profiles/${id}`);
    return data;
}

export async function updateMarginProfile(
    id: string,
    payload: CreateMarginProfileRequest
): Promise<ApiResponse<MarginProfile>> {
    const { data } = await api.put<ApiResponse<MarginProfile>>(`/margin-profiles/${id}`, payload);
    return data;
}

export async function deleteMarginProfile(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/margin-profiles/${id}`);
    return data;
}