import { useQuery } from "@tanstack/react-query";
import { getClientById } from "@/services";

export function useClient(id?: string) {
    return useQuery({
        queryKey: ["clients", id],
        queryFn: () => getClientById(id as string),
        enabled: !!id
    });
}
