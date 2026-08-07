import { useQuery } from "@tanstack/react-query";
import { getPartCuttingOrderById } from "@/services";

export function usePartCuttingOrder(id?: string) {
    return useQuery({
        queryKey: ["part-cutting-orders", id],
        queryFn: () => getPartCuttingOrderById(id as string),
        enabled: !!id
    });
}
