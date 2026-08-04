import { LoginForm } from "@/features/auth";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ROLES } from "@/constants/roles";

export function LoginPage() {

    const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {

    return (
        <Navigate
            to={user?.roleName === ROLES.PRODUCTION ? "/parts" : "/dashboard"}
            replace
        />
    );

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

                <div className="mb-6">
                    <img src="https://www.masqueunefecto.com/wp-content/uploads/2026/07/quantity-logo-blue.png"/>
                </div>
                <LoginForm />

            </div>

        </div>

    );

}