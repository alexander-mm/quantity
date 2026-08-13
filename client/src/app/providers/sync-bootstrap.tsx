import { useEffect } from "react";
import { useAuth, useOnlineStatus } from "@/hooks";
import { syncReferenceData, processOutbox } from "@/lib";

const OUTBOX_POLL_INTERVAL_MS = 45_000;

export function SyncBootstrap() {

    const { isAuthenticated } = useAuth();
    const isOnline = useOnlineStatus();

    useEffect(() => {

        if (!isAuthenticated || !isOnline) {
            return;
        }

        syncReferenceData().catch(() => {});
        processOutbox().catch(() => {});

        const interval = setInterval(() => {
            processOutbox().catch(() => {});
        }, OUTBOX_POLL_INTERVAL_MS);

        return () => clearInterval(interval);

    }, [isAuthenticated, isOnline]);

    return null;

}
