import { LoginForm } from "@/features/auth";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";

export function LoginPage() {

    const { isAuthenticated } = useAuth();

if (isAuthenticated) {

    return <Navigate to="/dashboard" replace />;

}

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#F8FAFC"
            }}
        >

            <div
                style={{
                    width: 380,
                    padding: 32,
                    background: "#FFFFFF",
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,.08)"
                }}
            >

                <h1>ORDEPLUS ERP</h1>
                <LoginForm />

            </div>

        </div>

    );

}