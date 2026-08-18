import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSale } from "@/services";
import type { UpdateSaleRequest } from "@/services";

export function useUpdateSale() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({ id, data }: { id: string; data: UpdateSaleRequest }) =>
            updateSale(id, data),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["sales"]
            });

        }

    });

}
