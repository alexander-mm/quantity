import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmInventoryMovement } from "@/services";

export function useConfirmInventoryMovement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmInventoryMovement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}
