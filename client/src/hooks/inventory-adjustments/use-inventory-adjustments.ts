import { useQuery } from "@tanstack/react-query";
import { getInventoryAdjustments } from "@/services";

export function useInventoryAdjustments() {
    return useQuery({
        queryKey: ["inventory-adjustments"],
        queryFn: getInventoryAdjustments
    });
}