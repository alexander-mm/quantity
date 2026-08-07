import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replaceProductPriceEntries } from "@/services";
import type { ReplaceProductPriceEntriesRequest } from "@/services";

export function useReplaceProductPriceEntries() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, data }: { productId: string; data: ReplaceProductPriceEntriesRequest }) =>
            replaceProductPriceEntries(productId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["product-price-entries", variables.productId] });
            queryClient.invalidateQueries({ queryKey: ["product-price-entry-labels"] });
        }
    });
}
