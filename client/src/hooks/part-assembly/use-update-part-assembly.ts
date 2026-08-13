import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePartAssembly } from "@/services";
import type { UpdatePartAssemblyRequest } from "@/services";

export function useUpdatePartAssembly() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePartAssemblyRequest }) =>
            updatePartAssembly(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-assemblies"] });
        }
    });
}