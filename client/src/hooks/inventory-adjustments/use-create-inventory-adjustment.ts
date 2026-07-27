import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventoryAdjustment } from "@/services";

export function useCreateInventoryAdjustment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createInventoryAdjustment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-adjustments"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
        }
    });
}