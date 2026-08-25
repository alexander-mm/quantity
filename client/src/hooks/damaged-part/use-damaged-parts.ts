import { useQuery } from "@tanstack/react-query";
import { getDamagedParts } from "@/services";

export function useDamagedParts() {
    return useQuery({
        queryKey: ["damaged-parts"],
        queryFn: getDamagedParts
    });
}
