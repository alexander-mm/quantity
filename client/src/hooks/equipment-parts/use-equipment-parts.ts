import { useQuery } from "@tanstack/react-query";
import { getEquipmentParts } from "@/services";

export function useEquipmentParts(productId?: string) {
    return useQuery({
        queryKey: ["equipment-parts", productId],
        queryFn: () => getEquipmentParts(productId as string),
        enabled: !!productId
    });
}
