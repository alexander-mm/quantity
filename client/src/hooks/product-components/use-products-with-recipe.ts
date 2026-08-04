import { useQuery } from "@tanstack/react-query";
import { getProductIdsWithRecipe } from "@/services";

export function useProductIdsWithRecipe() {
    return useQuery({
        queryKey: ["product-components", "with-recipe"],
        queryFn: getProductIdsWithRecipe
    });
}
