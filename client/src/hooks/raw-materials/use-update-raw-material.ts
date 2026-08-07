import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRawMaterial } from "@/services";
import type { CreateRawMaterialRequest } from "@/services";

export function useUpdateRawMaterial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateRawMaterialRequest }) =>
            updateRawMaterial(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
        }
    });
}
