import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelSale } from "@/services";

export function useCancelSale(){

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: cancelSale,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:["sales"]
            });

        }

    });

}
