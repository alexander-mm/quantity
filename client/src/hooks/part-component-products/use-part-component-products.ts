import { useQuery } from "@tanstack/react-query";
import { getPartComponentProducts } from "@/services";

export function usePartComponentProducts(partId?: string) {
    return useQuery({
        queryKey: ["part-component-products", partId],
        queryFn: () => getPartComponentProducts(partId as string),
        enabled: !!partId
    });
}