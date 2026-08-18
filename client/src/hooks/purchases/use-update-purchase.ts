import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePurchase } from "@/services";
import type { UpdatePurchaseRequest } from "@/services";

export function useUpdatePurchase() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseRequest }) =>
            updatePurchase(id, data),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["purchases"]
            });

        }

    });

}
