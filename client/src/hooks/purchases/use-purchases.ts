import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "@/services";

export function usePurchases(){

    return useQuery({

        queryKey:[
            "purchases"
        ],

        queryFn:getPurchases

    });

}