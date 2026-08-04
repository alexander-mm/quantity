import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmProductAssembly } from "@/services";

export function useConfirmProductAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmProductAssembly,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-assemblies"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
        }
    });
}
