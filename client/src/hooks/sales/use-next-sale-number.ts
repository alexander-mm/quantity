import { useQuery } from "@tanstack/react-query";
import { getNextSaleNumber } from "@/services";

export function useNextSaleNumber(storeId: string, enabled: boolean) {

    return useQuery({

        queryKey: [
            "sales",
            "next-number",
            storeId
        ],

        queryFn: () => getNextSaleNumber(storeId),

        enabled: enabled && !!storeId

    });

}
