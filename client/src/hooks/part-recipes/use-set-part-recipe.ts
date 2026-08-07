import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setPartRecipe } from "@/services";
import type { SetPartRecipeRequest } from "@/services";

export function useSetPartRecipe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ partId, data }: { partId: string; data: SetPartRecipeRequest }) =>
            setPartRecipe(partId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["part-recipes", variables.partId] });
        }
    });
}
