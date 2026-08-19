import { useQuery } from "@tanstack/react-query";
import { getPartProductionPreview } from "@/services";

export function usePartProductionPreview(partId?: string, quantity?: number) {
    return useQuery({
        queryKey: ["part-production", "preview", partId, quantity],
        queryFn: () => getPartProductionPreview(partId as string, quantity as number),
        enabled: !!partId && !!quantity && quantity > 0
    });
}
