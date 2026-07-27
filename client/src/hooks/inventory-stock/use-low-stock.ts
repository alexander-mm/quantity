import { useQuery } from "@tanstack/react-query";
import { getLowStock } from "@/services";

export function useLowStock() {
    return useQuery({
        queryKey: ["inventory-stock", "low-stock"],
        queryFn: getLowStock
    });
}
