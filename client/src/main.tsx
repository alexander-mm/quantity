import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import { AppProvider } from "@/app/providers/app-provider";
import router from "@/routes/router";
import "@/styles/globals.css";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
        <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);