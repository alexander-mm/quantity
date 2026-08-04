import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductAssembly } from "@/services";
import type { UpdateProductAssemblyRequest } from "@/services";

export function useUpdateProductAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductAssemblyRequest }) =>
            updateProductAssembly(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-assemblies"] });
        }
    });
}
