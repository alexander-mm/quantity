import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmPartCuttingOrder } from "@/services";
import type { ConfirmPartCuttingOrderRequest } from "@/services";

export function useConfirmPartCuttingOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ConfirmPartCuttingOrderRequest }) =>
            confirmPartCuttingOrder(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-cutting-orders"] });
            queryClient.invalidateQueries({ queryKey: ["parts"] });
            queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
        }
    });
}
