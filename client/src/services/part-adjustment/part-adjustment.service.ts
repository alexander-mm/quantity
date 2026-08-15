import { api } from "@/services/api";
import type { ApiResponse, PartAdjustment } from "@/types";

export async function getPartAdjustments():
    Promise<ApiResponse<PartAdjustment[]>> {
    const { data } = await api.get<
        ApiResponse<PartAdjustment[]>
    >("/part-adjustments");
    return data;
}

export type CreatePartAdjustmentRequest = {
    number: string;
    partId: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
};

export async function createPartAdjustment(
    payload: CreatePartAdjustmentRequest
): Promise<ApiResponse<PartAdjustment>> {
    const { data } = await api.post<
        ApiResponse<PartAdjustment>
    >(
        "/part-adjustments",
        payload
    );
    return data;
}
