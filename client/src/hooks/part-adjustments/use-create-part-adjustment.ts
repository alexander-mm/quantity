import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPartAdjustment } from "@/services";

export function useCreatePartAdjustment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPartAdjustment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-adjustments"] });
            queryClient.invalidateQueries({ queryKey: ["part-movements"] });
            queryClient.invalidateQueries({ queryKey: ["parts"] });
            queryClient.invalidateQueries({ queryKey: ["kardex"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}
