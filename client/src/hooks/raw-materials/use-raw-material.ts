import { useQuery } from "@tanstack/react-query";
import { getRawMaterialById } from "@/services";

export function useRawMaterial(id?: string) {
    return useQuery({
        queryKey: ["raw-materials", id],
        queryFn: () => getRawMaterialById(id as string),
        enabled: !!id
    });
}
