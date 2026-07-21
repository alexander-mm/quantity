import { api } from "@/services/api";

import type {

    ApiResponse,

    MarginProfile

} from "@/types";

export async function getMarginProfiles(): Promise<ApiResponse<MarginProfile[]>> {

    const { data } = await api.get<ApiResponse<MarginProfile[]>>("/margin-profiles");

    return data;

}