import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/services";

export function useUser(id?: string) {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => getUserById(id as string),
        enabled: !!id
    });
}
