import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelPurchase } from "@/services";

export function useCancelPurchase(){

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: cancelPurchase,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:["purchases"]
            });

        }

    });

}