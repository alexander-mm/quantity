import { useQuery } from "@tanstack/react-query";
import { getPartAssemblyPreview } from "@/services";

export function usePartAssemblyPreview(partId?: string, quantity?: number) {
    return useQuery({
        queryKey: ["part-assemblies", "preview", partId, quantity],
        queryFn: () => getPartAssemblyPreview(partId as string, quantity as number),
        enabled: !!partId && !!quantity && quantity > 0
    });
}