import { useQuery } from "@tanstack/react-query";
import { getNextAccountReceivableNumber } from "@/services";

export function useNextAccountReceivableNumber(enabled: boolean) {

    return useQuery({
        queryKey: ["accounts-receivable", "next-number"],
        queryFn: () => getNextAccountReceivableNumber(),
        enabled
    });

}
