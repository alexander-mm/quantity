import { api } from "@/services/api";

import type {

    ApiResponse,

    UnitOfMeasure

} from "@/types";

export async function getUnitsOfMeasure(): Promise<ApiResponse<UnitOfMeasure[]>> {

    const { data } = await api.get<ApiResponse<UnitOfMeasure[]>>("/units-of-measure");

    return data;

}

export type CreateUnitOfMeasureRequest = {
    code: string;
    name: string;
    description?: string;
};

export async function createUnitOfMeasure(
    payload: CreateUnitOfMeasureRequest
): Promise<ApiResponse<UnitOfMeasure>> {
    const { data } = await api.post<ApiResponse<UnitOfMeasure>>(
        "/units-of-measure",
        payload
    );
    return data;
}