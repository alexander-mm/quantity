import { createBrowserRouter } from "react-router-dom";
import { LoginPage, DashboardPage } from "@/pages";
import { ProtectedRoute } from "@/routes/components";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ProductsPage } from "@/pages/products/products.page";

const router = createBrowserRouter([

    {
        path: "/",

        element: <LoginPage />
    },

    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <DashboardPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/products",
        element: <ProductsPage />
    },
]);

export default router;