import { useQuery } from "@tanstack/react-query";
import { getPartAssemblyById } from "@/services";

export function usePartAssembly(id?: string) {
    return useQuery({
        queryKey: ["part-assemblies", id],
        queryFn: () => getPartAssemblyById(id as string),
        enabled: !!id
    });
}