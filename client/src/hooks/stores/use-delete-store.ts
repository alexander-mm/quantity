import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStore } from "@/services";

export function useDeleteStore() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteStore,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stores"] });
        }
    });
}
