import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventoryMovement } from "@/services";
import type { UpdateInventoryMovementRequest } from "@/services";

export function useUpdateInventoryMovement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateInventoryMovementRequest }) =>
            updateInventoryMovement(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
        }
    });
}
