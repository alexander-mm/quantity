import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMarginProfile } from "@/services";

export function useDeleteMarginProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMarginProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["margin-profiles"] });
            queryClient.invalidateQueries({ queryKey: ["product-prices"] });
        }
    });
}