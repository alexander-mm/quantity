import { useQuery } from "@tanstack/react-query";
import { getPartById } from "@/services";

export function usePart(id?: string) {
    return useQuery({
        queryKey: ["parts", id],
        queryFn: () => getPartById(id as string),
        enabled: !!id
    });
}
