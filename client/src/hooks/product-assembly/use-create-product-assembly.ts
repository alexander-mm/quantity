import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductAssembly } from "@/services";

export function useCreateProductAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProductAssembly,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-assemblies"] });
        }
    });
}
