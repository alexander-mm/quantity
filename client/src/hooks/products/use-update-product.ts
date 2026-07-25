import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    updateProduct,
    type UpdateProductRequest
} from "@/services";

export function useUpdateProduct() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({
            id,
            data
        }: {
            id: string;
            data: UpdateProductRequest;
        }) =>
            updateProduct(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
            queryClient.invalidateQueries({
                queryKey: ["product", variables.id]
            });
        }
    });
}