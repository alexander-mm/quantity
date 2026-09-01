import { useQuery } from "@tanstack/react-query";
import { getWeeklyReports } from "@/services";

export function useWeeklyReports() {
    return useQuery({
        queryKey: ["weekly-reports"],
        queryFn: () => getWeeklyReports()
    });
}
