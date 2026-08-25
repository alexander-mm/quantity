import { useQuery } from "@tanstack/react-query";
import { getDamagedStock } from "@/services";

export function useDamagedStock() {
    return useQuery({
        queryKey: ["damaged-stock"],
        queryFn: getDamagedStock
    });
}
