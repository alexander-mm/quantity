import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStockTransfer } from "@/services";
import type { UpdateStockTransferRequest } from "@/services";

export function useUpdateStockTransfer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStockTransferRequest }) =>
            updateStockTransfer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
        }
    });
}
