import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/services";

export function useRoles() {
    return useQuery({
        queryKey: ["roles"],
        queryFn: getRoles
    });
}
