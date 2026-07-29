import { useQuery } from "@tanstack/react-query";
import { getRoleById } from "@/services";

export function useRole(id?: string) {
    return useQuery({
        queryKey: ["roles", id],
        queryFn: () => getRoleById(id as string),
        enabled: !!id
    });
}