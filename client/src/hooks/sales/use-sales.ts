import { useQuery } from "@tanstack/react-query";
import { getSales } from "@/services";

export function useSales(){

    return useQuery({

        queryKey:[
            "sales"
        ],

        queryFn:getSales

    });

}
