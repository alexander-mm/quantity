import { useQuery } from "@tanstack/react-query";
import { getPartComponents } from "@/services";

export function usePartComponents(partId?: string) {
    return useQuery({
        queryKey: ["part-components", partId],
        queryFn: () => getPartComponents(partId as string),
        enabled: !!partId
    });
}