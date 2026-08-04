import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPartMovement } from "@/services";

export function useCreatePartMovement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPartMovement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-movements"] });
            queryClient.invalidateQueries({ queryKey: ["parts"] });
        }
    });
}
