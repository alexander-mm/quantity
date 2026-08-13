import { useEffect, useState } from "react";
import { liveQuery } from "dexie";

export function useLiveQuery<T>(querier: () => Promise<T>, deps: unknown[], defaultValue: T): T {

    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {

        const subscription = liveQuery(querier).subscribe({
            next: setValue,
            error: (error) => console.error("useLiveQuery error:", error)
        });

        return () => subscription.unsubscribe();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return value;

}
