import { useQuery } from "@tanstack/react-query";
import { getPartAdjustments } from "@/services";

export function usePartAdjustments() {
    return useQuery({
        queryKey: ["part-adjustments"],
        queryFn: getPartAdjustments
    });
}
