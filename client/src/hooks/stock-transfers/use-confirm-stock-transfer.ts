import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmStockTransfer } from "@/services";

export function useConfirmStockTransfer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmStockTransfer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}
