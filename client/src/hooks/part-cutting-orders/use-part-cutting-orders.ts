import { useQuery } from "@tanstack/react-query";
import { getPartCuttingOrders } from "@/services";

export function usePartCuttingOrders() {
    return useQuery({
        queryKey: ["part-cutting-orders"],
        queryFn: getPartCuttingOrders
    });
}
