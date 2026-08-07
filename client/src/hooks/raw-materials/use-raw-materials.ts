import { useQuery } from "@tanstack/react-query";
import { getRawMaterials } from "@/services";

export function useRawMaterials() {
    return useQuery({
        queryKey: ["raw-materials"],
        queryFn: getRawMaterials
    });
}
