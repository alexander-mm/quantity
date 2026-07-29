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
import { InventoryAdjustmentsPage } from "@/pages/inventory-adjustments";
import { UsersPage } from "@/pages/users";
import { BrandsPage } from "@/pages/brands";
import { UnitsOfMeasurePage } from "@/pages/units-of-measure";
import { CategoriesPage } from "@/pages/categories";
import { MarginProfilesPage } from "@/pages/margin-profiles";
import { StoresPage } from "@/pages/stores";
import { ROLES } from "@/constants/roles";

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
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <ProductsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
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
        path: "/inventory-adjustments",
        element: (
            <ProtectedRoute>
                <DashboardLayout>
                    <InventoryAdjustmentsPage />
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

    {
        path: "/users",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <UsersPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/brands",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <BrandsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/units-of-measure",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <UnitsOfMeasurePage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/categories",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <CategoriesPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/margin-profiles",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <MarginProfilesPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/stores",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <StoresPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },
]);


export default router;