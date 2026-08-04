import { useQuery } from "@tanstack/react-query";
import { getProductAssemblyPreview } from "@/services";

export function useProductAssemblyPreview(productId?: string, quantity?: number) {
    return useQuery({
        queryKey: ["product-assemblies", "preview", productId, quantity],
        queryFn: () => getProductAssemblyPreview(productId as string, quantity as number),
        enabled: !!productId && !!quantity && quantity > 0
    });
}
