import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    allowedRoles?: string[];
}>;

export function ProtectedRoute({

    children,

    allowedRoles

}: Props) {

    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;

    }

    if (
        allowedRoles &&
        (!user || !allowedRoles.includes(user.roleName))
    ) {

        return <Navigate to="/dashboard" replace />;

    }

    return children;

}