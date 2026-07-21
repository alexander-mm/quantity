import { api } from "@/services/api";

import type {

    ApiResponse,

    Brand

} from "@/types";

export async function getBrands(): Promise<ApiResponse<Brand[]>> {

    const { data } = await api.get<ApiResponse<Brand[]>>("/brands");

    return data;

}