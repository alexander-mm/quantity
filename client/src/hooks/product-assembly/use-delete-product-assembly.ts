import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductAssembly } from "@/services";

export function useDeleteProductAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProductAssembly,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-assemblies"] });
        }
    });
}
