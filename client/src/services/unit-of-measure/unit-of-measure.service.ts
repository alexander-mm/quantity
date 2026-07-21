import { api } from "@/services/api";

import type {

    ApiResponse,

    UnitOfMeasure

} from "@/types";

export async function getUnitsOfMeasure(): Promise<ApiResponse<UnitOfMeasure[]>> {

    const { data } = await api.get<ApiResponse<UnitOfMeasure[]>>("/units-of-measure");

    return data;

}