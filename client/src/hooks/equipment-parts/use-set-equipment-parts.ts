import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setEquipmentParts } from "@/services";
import type { SetEquipmentPartsRequest } from "@/services";

export function useSetEquipmentParts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, data }: { productId: string; data: SetEquipmentPartsRequest }) =>
            setEquipmentParts(productId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["equipment-parts", variables.productId] });
            queryClient.invalidateQueries({ queryKey: ["equipment-parts", "preview", variables.productId] });
        }
    });
}
