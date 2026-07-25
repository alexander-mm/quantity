import { createBrowserRouter } from "react-router-dom";
import { LoginPage, DashboardPage } from "@/pages";
import { ProtectedRoute } from "@/routes/components";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ProductsPage } from "@/pages/products/products.page";
import { InventoryMovementsPage } from "@/pages/inventory-movements";
import { InventoryStockPage } from "@/pages/inventory-stock";
import { KardexPage } from "@/pages/kardex";
import { SuppliersPage } from "@/pages";
import { PurchasesPage } from "@/pages/purchases";
import { SalesPage } from "@/pages/sales";

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

    {
        path: "/purchases",
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <PurchasesPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/sales",
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <SalesPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/inventory-movements",
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <InventoryMovementsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/inventory-stock",
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <InventoryStockPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/kardex",
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <KardexPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/suppliers",
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <SuppliersPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },
]);


export default router;