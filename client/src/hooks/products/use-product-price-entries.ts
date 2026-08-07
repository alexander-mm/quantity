import { useQuery } from "@tanstack/react-query";
import { getProductPriceEntries } from "@/services";

export function useProductPriceEntries(
    productId?: string
) {
    return useQuery({
        queryKey: ["product-price-entries", productId],
        queryFn: () => getProductPriceEntries(productId!),
        enabled: !!productId
    });
}
