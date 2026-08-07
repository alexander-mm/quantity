import { useQuery } from "@tanstack/react-query";
import { getInventoryStockByProduct } from "@/services";

export function useInventoryStockByProduct(productId?: string) {
    return useQuery({
        queryKey: ["inventory-stock", "product", productId],
        queryFn: () => getInventoryStockByProduct(productId!),
        enabled: !!productId
    });
}
