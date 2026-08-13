import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "@/services";
import type { CreateSaleRequest } from "@/services";
import { enqueueOutboxItem, isNetworkError } from "@/lib";

export type CreateSaleResult =
    | { queued: false; data: Awaited<ReturnType<typeof createSale>>["data"] }
    | { queued: true };

export function useCreateSale(){

    const queryClient=
        useQueryClient();

    return useMutation({

        mutationFn: async (payload: CreateSaleRequest): Promise<CreateSaleResult> => {

            if (!navigator.onLine) {
                await queueSale(payload);
                return { queued: true };
            }

            try {

                const response = await createSale(payload);
                return { queued: false, data: response.data };

            } catch (error) {

                if (isNetworkError(error)) {
                    await queueSale(payload);
                    return { queued: true };
                }

                throw error;

            }

        },

        onSuccess:(result)=>{

            if (!result.queued) {
                queryClient.invalidateQueries({
                    queryKey:[
                        "sales"
                    ]
                });
            }

        }

    });

}

async function queueSale(payload: CreateSaleRequest): Promise<void> {

    await enqueueOutboxItem({
        id: payload.clientUuid,
        entity: "sale",
        operation: "create",
        method: "POST",
        endpoint: "/sales",
        payload,
        storeId: payload.storeId,
        userId: payload.userId
    });

}
