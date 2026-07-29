import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStore } from "@/services";

export function useCreateStore() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createStore,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stores"] });
        }
    });
}
