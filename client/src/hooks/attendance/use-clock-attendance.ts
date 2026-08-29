import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clockAttendance } from "@/services";

export function useClockAttendance() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clockAttendance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance", "kiosk-context"] });
        }
    });
}
