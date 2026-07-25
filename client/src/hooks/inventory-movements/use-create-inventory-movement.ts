import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventoryMovement } from "@/services";

export function useCreateInventoryMovement() {
    const queryClient =
        useQueryClient();
    return useMutation({
        mutationFn:
            createInventoryMovement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "inventory-movements"
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "inventory-stock"
                ]
            });
        }
    });
}