import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setProductComponents } from "@/services";
import type { SetProductComponentsRequest } from "@/services";

export function useSetProductComponents() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, data }: { productId: string; data: SetProductComponentsRequest }) =>
            setProductComponents(productId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["product-components", variables.productId] });
            queryClient.invalidateQueries({ queryKey: ["product-components", "with-recipe"] });
        }
    });
}
