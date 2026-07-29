import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "@/services";

export function useCreateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        }
    });
}