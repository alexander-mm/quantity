import { useQuery } from "@tanstack/react-query";
import { getAccountReceivableSummary } from "@/services";

export function useAccountReceivableSummary() {
    return useQuery({
        queryKey: ["accounts-receivable", "summary"],
        queryFn: getAccountReceivableSummary
    });
}
