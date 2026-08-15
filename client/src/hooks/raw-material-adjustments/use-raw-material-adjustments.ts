import { useQuery } from "@tanstack/react-query";
import { getRawMaterialAdjustments } from "@/services";

export function useRawMaterialAdjustments() {
    return useQuery({
        queryKey: ["raw-material-adjustments"],
        queryFn: getRawMaterialAdjustments
    });
}
