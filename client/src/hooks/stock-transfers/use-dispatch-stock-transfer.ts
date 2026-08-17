import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchStockTransfer } from "@/services";

export function useDispatchStockTransfer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: dispatchStockTransfer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}
