import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPartAssembly } from "@/services";

export function useCreatePartAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPartAssembly,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-assemblies"] });
        }
    });
}