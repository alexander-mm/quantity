import { useQuery } from "@tanstack/react-query";
import { getStoreById } from "@/services";

export function useStore(id?: string) {
    return useQuery({
        queryKey: ["stores", id],
        queryFn: () => getStoreById(id as string),
        enabled: !!id
    });
}
