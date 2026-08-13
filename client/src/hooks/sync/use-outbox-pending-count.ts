import { offlineDb } from "@/lib/dexie";
import { useAuth } from "@/hooks/auth";
import { useLiveQuery } from "./use-live-query";

export function useOutboxPendingCount(entity?: string): number {

    const { user } = useAuth();
    const userId = user?.id;

    return useLiveQuery(
        () => {
            const collection = userId
                ? offlineDb.outbox.where("userId").equals(userId)
                : offlineDb.outbox.toCollection();

            return collection
                .filter(item =>
                    (item.status === "pending" || item.status === "error") &&
                    (!entity || item.entity === entity)
                )
                .count();
        },
        [entity, userId],
        0
    );

}
