import { useQuery } from "@tanstack/react-query";
import { getStockTransfers } from "@/services";

export function useStockTransfers(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["stock-transfers"],
        queryFn: getStockTransfers,
        enabled: options?.enabled ?? true
    });
}
