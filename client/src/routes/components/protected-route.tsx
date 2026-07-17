import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import type { PropsWithChildren } from "react";

export function ProtectedRoute({

    children

}: PropsWithChildren) {

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;

    }

    return children;

}