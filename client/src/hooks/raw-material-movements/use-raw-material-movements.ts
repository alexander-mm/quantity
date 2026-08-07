import { useQuery } from "@tanstack/react-query";
import { getRawMaterialMovements } from "@/services";

export function useRawMaterialMovements() {
    return useQuery({
        queryKey: ["raw-material-movements"],
        queryFn: getRawMaterialMovements
    });
}
