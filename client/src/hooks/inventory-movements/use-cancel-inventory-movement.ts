import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelInventoryMovement } from "@/services";

export function useCancelInventoryMovement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelInventoryMovement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
        }
    });
}
