import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccountReceivablePayment } from "@/services";
import type { CreateAccountReceivablePaymentRequest } from "@/services";

export function useCreateAccountReceivablePayment() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({
            id,
            data
        }: {
            id: string;
            data: CreateAccountReceivablePaymentRequest;
        }) => createAccountReceivablePayment(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts-receivable"] });
        }

    });

}
