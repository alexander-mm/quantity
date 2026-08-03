import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockTransfer } from "@/services";

export function useCreateStockTransfer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createStockTransfer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
        }
    });
}
