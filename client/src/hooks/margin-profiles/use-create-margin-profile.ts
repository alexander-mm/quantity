import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMarginProfile } from "@/services";

export function useCreateMarginProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMarginProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["margin-profiles"] });
        }
    });
}
