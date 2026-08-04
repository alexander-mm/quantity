import { useQuery } from "@tanstack/react-query";
import { getPartMovements } from "@/services";

export function usePartMovements() {
    return useQuery({
        queryKey: ["part-movements"],
        queryFn: getPartMovements
    });
}
