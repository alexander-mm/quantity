import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmPartAssembly } from "@/services";

export function useConfirmPartAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmPartAssembly,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-assemblies"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
            queryClient.invalidateQueries({ queryKey: ["parts"] });
            queryClient.invalidateQueries({ queryKey: ["part-movements"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });
}