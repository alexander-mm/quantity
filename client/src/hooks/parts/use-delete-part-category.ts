import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePartCategory } from "@/services";

export function useDeletePartCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePartCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-categories"] });
        }
    });
}
