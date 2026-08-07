import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRawMaterial } from "@/services";

export function useCreateRawMaterial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRawMaterial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
            queryClient.invalidateQueries({ queryKey: ["raw-material-movements"] });
        }
    });
}
