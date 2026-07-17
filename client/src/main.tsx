import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AppProvider } from "@/app/providers/app-provider";
import router from "@/routes/router";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
        <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);