import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voidSale } from "@/services";

export function useVoidSale(){

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: voidSale,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:["sales"]
            });

        }

    });

}
