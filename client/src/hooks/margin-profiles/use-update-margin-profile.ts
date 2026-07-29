import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMarginProfile } from "@/services";
import type { CreateMarginProfileRequest } from "@/services";

export function useUpdateMarginProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateMarginProfileRequest }) =>
            updateMarginProfile(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["margin-profiles"] });
            queryClient.invalidateQueries({ queryKey: ["product-prices"] });
        }
    });
}
