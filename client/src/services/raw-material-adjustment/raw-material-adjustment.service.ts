import { api } from "@/services/api";
import type { ApiResponse, RawMaterialAdjustment } from "@/types";

export async function getRawMaterialAdjustments():
    Promise<ApiResponse<RawMaterialAdjustment[]>> {
    const { data } = await api.get<
        ApiResponse<RawMaterialAdjustment[]>
    >("/raw-material-adjustments");
    return data;
}

export type CreateRawMaterialAdjustmentRequest = {
    number: string;
    rawMaterialId: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
};

export async function createRawMaterialAdjustment(
    payload: CreateRawMaterialAdjustmentRequest
): Promise<ApiResponse<RawMaterialAdjustment>> {
    const { data } = await api.post<
        ApiResponse<RawMaterialAdjustment>
    >(
        "/raw-material-adjustments",
        payload
    );
    return data;
}
