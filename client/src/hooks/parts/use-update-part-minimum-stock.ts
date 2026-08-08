import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePartMinimumStock } from "@/services";

export function useUpdatePartMinimumStock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, minimumStock }: { id: string; minimumStock: number }) =>
            updatePartMinimumStock(id, minimumStock),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["parts"] });
        }
    });
}
