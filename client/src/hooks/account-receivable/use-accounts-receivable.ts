import { useQuery } from "@tanstack/react-query";
import { getAccountsReceivable } from "@/services";

export function useAccountsReceivable() {
    return useQuery({
        queryKey: ["accounts-receivable"],
        queryFn: getAccountsReceivable
    });
}
