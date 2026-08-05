import { useQuery } from "@tanstack/react-query";
import { getWholesalerCreditSummary } from "@/services";

export function useWholesalerCreditSummary() {
    return useQuery({
        queryKey: ["accounts-receivable", "summary"],
        queryFn: getWholesalerCreditSummary
    });
}
