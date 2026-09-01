import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateCustomWeeklyReport } from "@/services";

export function useGenerateCustomWeeklyReport() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateCustomWeeklyReport,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weekly-reports"] });
        }
    });

}
