import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStockTransfer } from "@/services";

export function useDeleteStockTransfer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteStockTransfer,
        onSuccess: () => {
            // Si el envío ya había sido despachado, cancelar revierte esa salida
            // devolviendo el stock al origen — hay que refrescar inventario también.
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}
