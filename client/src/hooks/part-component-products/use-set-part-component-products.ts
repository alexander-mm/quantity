import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setPartComponentProducts } from "@/services";
import type { SetPartComponentProductsRequest } from "@/services";

export function useSetPartComponentProducts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ partId, data }: { partId: string; data: SetPartComponentProductsRequest }) =>
            setPartComponentProducts(partId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["part-component-products", variables.partId] });
        }
    });
}