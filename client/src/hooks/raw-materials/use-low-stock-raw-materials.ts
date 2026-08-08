import { useQuery } from "@tanstack/react-query";
import { getLowStockRawMaterials } from "@/services";

export function useLowStockRawMaterials() {
    return useQuery({
        queryKey: ["raw-materials", "low-stock"],
        queryFn: getLowStockRawMaterials
    });
}
