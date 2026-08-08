import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductMinimumStock } from "@/services";

export function useUpdateProductMinimumStock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, minimumStock }: { id: string; minimumStock: number }) =>
            updateProductMinimumStock(id, minimumStock),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
}
