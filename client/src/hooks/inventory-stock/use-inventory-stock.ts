import { useQuery } from "@tanstack/react-query";
import { getInventoryStock } from "@/services";

export function useInventoryStock() {
    return useQuery({
        queryKey: ["inventory-stock"],
        queryFn: getInventoryStock
    });
}