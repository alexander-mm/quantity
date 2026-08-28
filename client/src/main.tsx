import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import { AppProvider } from "@/app/providers/app-provider";
import router from "@/routes/router";
import "@/styles/globals.css";

const SW_UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;

    setInterval(() => {
      registration.update();
    }, SW_UPDATE_CHECK_INTERVAL_MS);

    // En Android, Chrome suspende los timers de una pestaña/PWA en segundo plano
    // (el intervalo de arriba deja de dispararse) — por eso una app que queda
    // minimizada por horas/días se queda con el bundle viejo y termina hablando
    // con un backend que ya cambió de forma. Forzamos el chequeo apenas la app
    // vuelve a primer plano, que es exactamente cuando el usuario va a usarla.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        registration.update();
      }
    });

    window.addEventListener("focus", () => {
      registration.update();
    });
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
        <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);