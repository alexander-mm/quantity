import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPartCuttingOrder } from "@/services";

export function useCreatePartCuttingOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPartCuttingOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-cutting-orders"] });
        }
    });
}
