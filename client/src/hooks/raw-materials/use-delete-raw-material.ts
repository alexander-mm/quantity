import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRawMaterial } from "@/services";

export function useDeleteRawMaterial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRawMaterial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
        }
    });
}
