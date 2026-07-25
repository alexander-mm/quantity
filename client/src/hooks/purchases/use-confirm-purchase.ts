import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmPurchase } from "@/services";

export function useConfirmPurchase(){

    const queryClient=
        useQueryClient();

    return useMutation({

        mutationFn:
            confirmPurchase,

        onSuccess:()=>{

            queryClient.invalidateQueries({
                queryKey:[
                    "purchases"
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

        }

    });

}