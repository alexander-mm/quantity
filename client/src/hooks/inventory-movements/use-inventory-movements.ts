import { useQuery } from "@tanstack/react-query";
import { getInventoryMovements } from "@/services";

export function useInventoryMovements() {
    return useQuery({
        queryKey: ["inventory-movements"],
        queryFn: getInventoryMovements
    });
}