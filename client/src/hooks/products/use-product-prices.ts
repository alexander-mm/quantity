import { useQuery } from "@tanstack/react-query";
import { getProductPrices } from "@/services";

export function useProductPrices(
    productId?: string
) {
    return useQuery({
        queryKey: ["product-prices", productId],
        queryFn: () => getProductPrices(productId!),
        enabled: !!productId
    });
}
