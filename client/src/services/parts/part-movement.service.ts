import { api } from "@/services/api";
import type { ApiResponse, PartMovement, PartMovementType } from "@/types";

export async function getPartMovements(): Promise<ApiResponse<PartMovement[]>> {
    const { data } = await api.get<ApiResponse<PartMovement[]>>("/part-movements");
    return data;
}

export type CreatePartMovementRequest = {
    number: string;
    type: PartMovementType;
    movementDate: Date;
    observations?: string;
    details: {
        partId: string;
        quantity: number;
    }[];
};

export async function createPartMovement(
    payload: CreatePartMovementRequest
): Promise<ApiResponse<PartMovement>> {
    const { data } = await api.post<ApiResponse<PartMovement>>("/part-movements", payload);
    return data;
}
