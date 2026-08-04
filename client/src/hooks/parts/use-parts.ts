import { useQuery } from "@tanstack/react-query";
import { getParts } from "@/services";

export function useParts() {
    return useQuery({
        queryKey: ["parts"],
        queryFn: getParts
    });
}
