import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 3000;

export function useOnlineStatus() {

    const [isOnline, setIsOnline] = useState(() => navigator.onLine);

    useEffect(() => {

        const sync = () => setIsOnline(navigator.onLine);

        window.addEventListener("online", sync);
        window.addEventListener("offline", sync);

        // Los eventos "online"/"offline" del navegador no siempre disparan de forma
        // confiable con la emulación de red de DevTools (a diferencia de perder la
        // conexión de verdad) — este sondeo periódico es el respaldo para que el estado
        // igual converja en unos segundos.
        const interval = setInterval(sync, POLL_INTERVAL_MS);

        return () => {
            window.removeEventListener("online", sync);
            window.removeEventListener("offline", sync);
            clearInterval(interval);
        };

    }, []);

    return isOnline;

}
