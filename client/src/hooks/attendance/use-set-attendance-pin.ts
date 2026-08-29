import { useMutation } from "@tanstack/react-query";
import { setAttendancePin } from "@/services";

export function useSetAttendancePin() {
    return useMutation({
        mutationFn: ({ userId, pin }: { userId: string; pin: string }) =>
            setAttendancePin(userId, pin)
    });
}
