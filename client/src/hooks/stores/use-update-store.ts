import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStore } from "@/services";
import type { CreateStoreRequest } from "@/services";

export function useUpdateStore() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateStoreRequest }) =>
            updateStore(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stores"] });
        }
    });
}
