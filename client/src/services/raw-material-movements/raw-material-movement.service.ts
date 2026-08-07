import { api } from "@/services/api";
import type { ApiResponse, RawMaterialMovement, RawMaterialMovementType } from "@/types";

export async function getRawMaterialMovements(): Promise<ApiResponse<RawMaterialMovement[]>> {
    const { data } = await api.get<ApiResponse<RawMaterialMovement[]>>("/raw-material-movements");
    return data;
}

export type CreateRawMaterialMovementDetailRequest = {
    rawMaterialId: string;
    quantity: number;
};

export type CreateRawMaterialMovementRequest = {
    number: string;
    type: RawMaterialMovementType;
    movementDate: Date;
    observations?: string;
    details: CreateRawMaterialMovementDetailRequest[];
};

export async function createRawMaterialMovement(
    payload: CreateRawMaterialMovementRequest
): Promise<ApiResponse<RawMaterialMovement>> {
    const { data } = await api.post<ApiResponse<RawMaterialMovement>>("/raw-material-movements", payload);
    return data;
}
