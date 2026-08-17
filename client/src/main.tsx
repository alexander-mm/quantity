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
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
        <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);