import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePartRecipe } from "@/services";

export function useDeletePartRecipe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (partId: string) => deletePartRecipe(partId),
        onSuccess: (_, partId) => {
            queryClient.invalidateQueries({ queryKey: ["part-recipes", partId] });
        }
    });
}
