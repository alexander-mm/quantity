import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage, DashboardPage } from "@/pages";
import { ProtectedRoute } from "@/routes/components";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/hooks";
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
import { RolesPage } from "@/pages/roles";
import { StockTransfersPage } from "@/pages/stock-transfers";
import { PendingReceptionsPage } from "@/pages/pending-receptions";
import { TransferIssuesPage } from "@/pages/transfer-issues";
import { ClientsPage } from "@/pages/clients";
import { PartsPage } from "@/pages/parts";
import { PartMovementsPage } from "@/pages/part-movements";
import { AssemblyPage } from "@/pages/assembly";

function DashboardRoute() {

    const { user } = useAuth();

    if (user?.roleName === ROLES.PRODUCTION) {
        return <Navigate to="/parts" replace />;
    }

    return (
        <DashboardLayout>
            <DashboardPage />
        </DashboardLayout>
    );

}

const router = createBrowserRouter([

    {
        path: "/",

        element: <LoginPage />
    },

    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardRoute />
            </ProtectedRoute>
        )
    },

    {
        path: "/products",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <ProductsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/clients",
        element: (
            <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <ClientsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/purchases",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <PurchasesPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/sales",
        element: (
            <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <SalesPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/inventory-movements",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <InventoryMovementsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/inventory-adjustments",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <InventoryAdjustmentsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/inventory-stock",
        element: (
            <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <InventoryStockPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/kardex",
        element: (
            <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <KardexPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/suppliers",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
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

    {
    path: "/roles",
    element: (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout>
                <RolesPage />
            </DashboardLayout>
        </ProtectedRoute>
    )
},

{
    path: "/stock-transfers",
    element: (
        <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
            <DashboardLayout>
                <StockTransfersPage />
            </DashboardLayout>
        </ProtectedRoute>
    )
},

    {
        path: "/pending-receptions",
        element: (
            <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <PendingReceptionsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/transfer-issues",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <TransferIssuesPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/parts",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <PartsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/part-movements",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <PartMovementsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/assembly",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <AssemblyPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },
]);


export default router;