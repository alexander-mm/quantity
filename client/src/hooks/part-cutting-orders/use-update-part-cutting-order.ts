import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePartCuttingOrder } from "@/services";
import type { UpdatePartCuttingOrderRequest } from "@/services";

export function useUpdatePartCuttingOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePartCuttingOrderRequest }) =>
            updatePartCuttingOrder(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-cutting-orders"] });
        }
    });
}
