import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRawMaterialAdjustment } from "@/services";

export function useCreateRawMaterialAdjustment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRawMaterialAdjustment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["raw-material-adjustments"] });
            queryClient.invalidateQueries({ queryKey: ["raw-material-movements"] });
            queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
            queryClient.invalidateQueries({ queryKey: ["kardex"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}
