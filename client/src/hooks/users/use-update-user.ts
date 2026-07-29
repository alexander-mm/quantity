import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services";
import type { UpdateUserRequest } from "@/services";

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
            updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });
}
