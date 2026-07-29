import { useQuery } from "@tanstack/react-query";
import { getMarginProfileById } from "@/services";

export function useMarginProfile(id?: string) {
    return useQuery({
        queryKey: ["margin-profiles", id],
        queryFn: () => getMarginProfileById(id as string),
        enabled: !!id
    });
}