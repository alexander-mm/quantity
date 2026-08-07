import { useQuery } from "@tanstack/react-query";
import { getProductPriceEntryLabels } from "@/services";

export function useProductPriceEntryLabels() {
    return useQuery({
        queryKey: ["product-price-entry-labels"],
        queryFn: () => getProductPriceEntryLabels()
    });
}
