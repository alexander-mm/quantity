import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmSale } from "@/services";

export function useConfirmSale(){

    const queryClient=
        useQueryClient();

    return useMutation({

        mutationFn:
            confirmSale,

        onSuccess:()=>{

            queryClient.invalidateQueries({
                queryKey:[
                    "sales"
                ]
            });

            queryClient.invalidateQueries({
                queryKey:[
                    "inventory-movements"
                ]
            });

            queryClient.invalidateQueries({
                queryKey:[
                    "inventory-stock"
                ]
            });

            queryClient.invalidateQueries({
                queryKey:[
                    "accounts-receivable"
                ]
            });

            queryClient.invalidateQueries({
                queryKey:[
                    "dashboard"
                ]
            });

        }

    });

}
