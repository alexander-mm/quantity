import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePartAssembly } from "@/services";

export function useDeletePartAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePartAssembly,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-assemblies"] });
        }
    });
}