import { useEffect, useRef, useState } from "react";
import { useOnlineStatus } from "./use-online-status";

export function useOfflineCollection<T>(
    liveData: T[] | undefined,
    readCached: () => Promise<T[]>
): T[] {

    const isOnline = useOnlineStatus();
    const [cached, setCached] = useState<T[]>([]);
    const readCachedRef = useRef(readCached);

    useEffect(() => {
        readCachedRef.current = readCached;
    });

    const hasLiveData = !!liveData && liveData.length > 0;

    useEffect(() => {

        if (isOnline || hasLiveData) {
            return;
        }

        let cancelled = false;

        readCachedRef.current().then((rows) => {
            if (!cancelled) {
                setCached(rows);
            }
        });

        return () => {
            cancelled = true;
        };

    }, [isOnline, hasLiveData]);

    if (hasLiveData) {
        return liveData;
    }

    return isOnline ? (liveData ?? []) : cached;

}
