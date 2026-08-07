import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmProductAssembly } from "@/services";

export function useConfirmProductAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmProductAssembly,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-assemblies"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
            queryClient.invalidateQueries({ queryKey: ["parts"] });
            queryClient.invalidateQueries({ queryKey: ["part-movements"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}
