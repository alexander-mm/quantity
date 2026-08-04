import { useQuery } from "@tanstack/react-query";
import { getProductAssemblyById } from "@/services";

export function useProductAssembly(id?: string) {
    return useQuery({
        queryKey: ["product-assemblies", id],
        queryFn: () => getProductAssemblyById(id as string),
        enabled: !!id
    });
}
