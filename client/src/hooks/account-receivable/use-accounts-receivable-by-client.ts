import { useQuery } from "@tanstack/react-query";
import { getAccountsReceivableByClient } from "@/services";

export function useAccountsReceivableByClient(clientId?: string) {
    return useQuery({
        queryKey: ["accounts-receivable", "by-client", clientId],
        queryFn: () => getAccountsReceivableByClient(clientId as string),
        enabled: !!clientId
    });
}
