import { offlineDb, type OutboxItem } from "@/lib/dexie";
import { useAuth } from "@/hooks/auth";
import { useLiveQuery } from "./use-live-query";

export function useOutboxItems(): OutboxItem[] {

    const { user } = useAuth();
    const userId = user?.id;

    return useLiveQuery(
        () => {

            const collection = userId
                ? offlineDb.outbox.where("userId").equals(userId)
                : offlineDb.outbox.toCollection();

            return collection
                .filter(item => item.status === "pending" || item.status === "error")
                .sortBy("createdAt");

        },
        [userId],
        []
    );

}
