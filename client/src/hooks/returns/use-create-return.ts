import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReturn } from "@/services";
import type { CreateReturnRequest } from "@/services";
import { enqueueOutboxItem, isNetworkError } from "@/lib";
import { useAuth } from "@/hooks/auth";

export type CreateReturnResult =
    | { queued: false; data: Awaited<ReturnType<typeof createReturn>>["data"] }
    | { queued: true };

export function useCreateReturn() {

    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    return useMutation({

        mutationFn: async (payload: CreateReturnRequest): Promise<CreateReturnResult> => {

            if (!navigator.onLine) {
                await queueReturn(payload, userId);
                return { queued: true };
            }

            try {

                const response = await createReturn(payload);
                return { queued: false, data: response.data };

            } catch (error) {

                if (isNetworkError(error)) {
                    await queueReturn(payload, userId);
                    return { queued: true };
                }

                throw error;

            }

        },

        onSuccess: (result) => {

            if (!result.queued) {
                queryClient.invalidateQueries({ queryKey: ["returns"] });
                queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            }

        }

    });

}

async function queueReturn(payload: CreateReturnRequest, userId: string | undefined): Promise<void> {

    await enqueueOutboxItem({
        id: payload.clientUuid,
        entity: "return",
        operation: "create",
        method: "POST",
        endpoint: "/returns",
        payload,
        storeId: payload.storeId,
        userId
    });

}
