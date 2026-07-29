import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "@/services";

export function useDeleteRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        }
    });
}