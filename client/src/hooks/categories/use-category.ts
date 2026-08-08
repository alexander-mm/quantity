import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "@/services";

export function useCategory(id?: string) {
    return useQuery({
        queryKey: ["categories", id],
        queryFn: () => getCategoryById(id as string),
        enabled: !!id
    });
}
