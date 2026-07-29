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