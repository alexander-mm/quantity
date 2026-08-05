import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccountReceivable } from "@/services";
import type { UpdateAccountReceivableRequest } from "@/services";

export function useUpdateAccountReceivable() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAccountReceivableRequest }) =>
            updateAccountReceivable(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts-receivable"] });
        }
    });
}
