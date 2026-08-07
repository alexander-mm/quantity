import { useQuery } from "@tanstack/react-query";
import { getPartRecipeByPart } from "@/services";

export function usePartRecipe(partId?: string) {
    return useQuery({
        queryKey: ["part-recipes", partId],
        queryFn: () => getPartRecipeByPart(partId as string),
        enabled: !!partId
    });
}
