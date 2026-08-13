import { useQuery } from "@tanstack/react-query";
import { getPartAssemblies } from "@/services";

export function usePartAssemblies() {
    return useQuery({
        queryKey: ["part-assemblies"],
        queryFn: getPartAssemblies
    });
}