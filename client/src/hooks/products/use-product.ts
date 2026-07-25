import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services";

export function useProduct(
    id?: string
) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id!),
        enabled: !!id
    });
}