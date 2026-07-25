import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPurchase } from "@/services";

export function useCreatePurchase(){

    const queryClient=
        useQueryClient();

    return useMutation({

        mutationFn:
            createPurchase,

        onSuccess:()=>{

            queryClient.invalidateQueries({
                queryKey:[
                    "purchases"
                ]
            });

        }

    });

}