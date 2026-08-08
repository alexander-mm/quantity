import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRawMaterialMinimumStock } from "@/services";

export function useUpdateRawMaterialMinimumStock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, minimumStock }: { id: string; minimumStock: number }) =>
            updateRawMaterialMinimumStock(id, minimumStock),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
        }
    });
}
