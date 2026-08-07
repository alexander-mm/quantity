import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRawMaterialMovement } from "@/services";

export function useCreateRawMaterialMovement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRawMaterialMovement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["raw-material-movements"] });
            queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
        }
    });
}
