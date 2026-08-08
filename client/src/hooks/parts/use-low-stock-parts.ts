import { useQuery } from "@tanstack/react-query";
import { getLowStockParts } from "@/services";

export function useLowStockParts() {
    return useQuery({
        queryKey: ["parts", "low-stock"],
        queryFn: getLowStockParts
    });
}
