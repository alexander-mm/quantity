import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePartCuttingOrder } from "@/services";

export function useDeletePartCuttingOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePartCuttingOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-cutting-orders"] });
        }
    });
}
