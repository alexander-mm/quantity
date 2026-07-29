import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRole } from "@/services";
import type { CreateRoleRequest } from "@/services";

export function useUpdateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateRoleRequest }) =>
            updateRole(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        }
    });
}