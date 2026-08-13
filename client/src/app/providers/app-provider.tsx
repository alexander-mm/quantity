import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./query-provider";
import { SyncBootstrap } from "./sync-bootstrap";

export function AppProvider({
    children
}: PropsWithChildren) {

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <SyncBootstrap />
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <ReactQueryDevtools
                initialIsOpen={false}
            />
        </QueryClientProvider>
    );
}