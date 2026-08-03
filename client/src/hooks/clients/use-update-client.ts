import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "@/services";
import type { CreateClientRequest } from "@/services";

export function useUpdateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateClientRequest }) =>
            updateClient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        }
    });
}
