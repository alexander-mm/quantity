import { useQuery } from "@tanstack/react-query";
import { getKioskContext } from "@/services";

const KIOSK_REFRESH_INTERVAL_MS = 30_000;

export function useKioskContext() {
    return useQuery({
        queryKey: ["attendance", "kiosk-context"],
        queryFn: getKioskContext,
        refetchInterval: KIOSK_REFRESH_INTERVAL_MS,
        retry: false
    });
}
