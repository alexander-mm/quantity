import { useQuery } from "@tanstack/react-query";
import { getPartIdsWithRecipe } from "@/services";

export function usePartIdsWithRecipe() {
    return useQuery({
        queryKey: ["part-components", "with-recipe"],
        queryFn: getPartIdsWithRecipe
    });
}