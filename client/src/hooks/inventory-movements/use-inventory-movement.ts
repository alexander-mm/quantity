import { useQuery } from "@tanstack/react-query";
import { getInventoryMovementById } from "@/services";

export function useInventoryMovement(
    id?: string
) {
    return useQuery({
        queryKey: [
            "inventory-movement",
            id
        ],
        queryFn: () =>
            getInventoryMovementById(id!),
        enabled: !!id
    });
}