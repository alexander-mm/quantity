import { useQuery } from "@tanstack/react-query";
import { getAttendanceHistory } from "@/services";
import type { AttendanceFilters } from "@/types";

export function useAttendanceHistory(filters: AttendanceFilters) {
    return useQuery({
        queryKey: ["attendance", "history", filters],
        queryFn: () => getAttendanceHistory(filters)
    });
}
