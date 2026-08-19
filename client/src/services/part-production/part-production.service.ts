import { api } from "@/services/api";
import type { ApiResponse, PartProductionPreview } from "@/types";

export async function getPartProductionPreview(
    partId: string,
    quantity: number
): Promise<ApiResponse<PartProductionPreview>> {
    const { data } = await api.get<ApiResponse<PartProductionPreview>>(
        `/part-production/preview/${partId}`,
        { params: { quantity } }
    );
    return data;
}
