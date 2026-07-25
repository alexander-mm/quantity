import { useQuery } from "@tanstack/react-query";
import { getMovementTypes } from "@/services";

export function useMovementTypes() {
    return useQuery({
        queryKey: ["movement-types"],
        queryFn: getMovementTypes
    });
}