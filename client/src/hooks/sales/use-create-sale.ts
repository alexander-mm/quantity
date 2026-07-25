import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "@/services";

export function useCreateSale(){

    const queryClient=
        useQueryClient();

    return useMutation({

        mutationFn:
            createSale,

        onSuccess:()=>{

            queryClient.invalidateQueries({
                queryKey:[
                    "sales"
                ]
            });

        }

    });

}
