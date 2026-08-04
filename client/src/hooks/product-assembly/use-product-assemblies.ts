import { useQuery } from "@tanstack/react-query";
import { getProductAssemblies } from "@/services";

export function useProductAssemblies() {
    return useQuery({
        queryKey: ["product-assemblies"],
        queryFn: getProductAssemblies
    });
}
