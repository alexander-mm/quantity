import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveStockTransfer } from "@/services";
import type { ResolveStockTransferRequest } from "@/services";

export function useResolveStockTransfer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ResolveStockTransferRequest }) =>
            resolveStockTransfer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}
