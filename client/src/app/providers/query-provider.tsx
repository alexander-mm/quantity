import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            // Al navegar a una página que ya tiene datos en caché, siempre revalida en segundo
            // plano (muestra el caché al instante y lo actualiza si cambió). Esto evita que un
            // cambio hecho en otra pantalla se quede sin verse hasta recargar la página completa.
            refetchOnMount: "always",
            staleTime: 1000 * 60 * 5
        }
    }
});