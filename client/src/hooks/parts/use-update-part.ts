import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePart } from "@/services";
import type { CreatePartRequest } from "@/services";

export function useUpdatePart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreatePartRequest }) =>
            updatePart(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["parts"] });
        }
    });
}
