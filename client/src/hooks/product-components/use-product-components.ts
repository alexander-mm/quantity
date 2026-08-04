import { useQuery } from "@tanstack/react-query";
import { getProductComponents } from "@/services";

export function useProductComponents(productId?: string) {
    return useQuery({
        queryKey: ["product-components", productId],
        queryFn: () => getProductComponents(productId as string),
        enabled: !!productId
    });
}
