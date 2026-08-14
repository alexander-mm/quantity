import { useEffect, useRef, useState } from "react";

export function useOfflineCollection<T>(
    liveData: T[] | undefined,
    readCached: () => Promise<T[]>
): T[] {

    const [cached, setCached] = useState<T[]>([]);
    const readCachedRef = useRef(readCached);

    useEffect(() => {
        readCachedRef.current = readCached;
    });

    const hasLiveData = !!liveData && liveData.length > 0;

    useEffect(() => {

        // No dependemos de navigator.onLine/eventos de conexión aquí — no son confiables
        // (ej. con la emulación de red de DevTools, o justo tras recargar la página).
        // En su lugar: si todavía no hay datos en vivo (sea porque estamos offline o porque
        // la petición sigue en curso), se intenta leer del caché local como respaldo. En
        // cuanto la petición en vivo resuelva, esos datos tienen prioridad de todas formas.
        if (hasLiveData) {
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

    }, [hasLiveData]);

    return hasLiveData ? liveData : cached;

}
