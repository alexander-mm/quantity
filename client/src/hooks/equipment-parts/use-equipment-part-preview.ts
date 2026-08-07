import { useQuery } from "@tanstack/react-query";
import { getEquipmentPartPreview } from "@/services";

export function useEquipmentPartPreview(productId?: string, quantity?: number) {
    return useQuery({
        queryKey: ["equipment-parts", "preview", productId, quantity],
        queryFn: () => getEquipmentPartPreview(productId as string, quantity as number),
        enabled: !!productId && !!quantity && quantity > 0
    });
}
