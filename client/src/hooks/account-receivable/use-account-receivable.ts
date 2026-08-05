import { useQuery } from "@tanstack/react-query";
import { getAccountReceivableById } from "@/services";

export function useAccountReceivable(id?: string) {
    return useQuery({
        queryKey: ["accounts-receivable", id],
        queryFn: () => getAccountReceivableById(id as string),
        enabled: !!id
    });
}
