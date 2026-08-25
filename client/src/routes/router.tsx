import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "@/pages";
import { ProtectedRoute } from "@/routes/components";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { DashboardRoute } from "./dashboard-route";
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
import { ReturnsPage } from "@/pages/returns";
import { DamagedInventoryPage } from "@/pages/damaged-inventory";
import { PendingSyncPage } from "@/pages/pending-sync";
import { PendingReceptionsPage } from "@/pages/pending-receptions";
import { TransferIssuesPage } from "@/pages/transfer-issues";
import { ClientsPage } from "@/pages/clients";
import { PartsPage } from "@/pages/parts";
import { PartCategoriesPage } from "@/pages/part-categories";
import { PartMovementsPage } from "@/pages/part-movements";
import { PartAdjustmentsPage } from "@/pages/part-adjustments";
import { AssemblyPage } from "@/pages/assembly";
import { WholesalersPage, WholesalerDetailPage } from "@/pages/wholesalers";
import { RawMaterialsPage } from "@/pages/raw-materials";
import { RawMaterialMovementsPage } from "@/pages/raw-material-movements";
import { RawMaterialAdjustmentsPage } from "@/pages/raw-material-adjustments";
import { EquipmentPartsPage } from "@/pages/equipment-parts";
import { PartCuttingOrdersPage } from "@/pages/part-cutting-orders";

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
            <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
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
    path: "/returns",
    element: (
        <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
            <DashboardLayout>
                <ReturnsPage />
            </DashboardLayout>
        </ProtectedRoute>
    )
},

{
    path: "/damaged-inventory",
    element: (
        <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
            <DashboardLayout>
                <DamagedInventoryPage />
            </DashboardLayout>
        </ProtectedRoute>
    )
},

{
    path: "/pending-sync",
    element: (
        <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
            <DashboardLayout>
                <PendingSyncPage />
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
            <ProtectedRoute blockedRoles={[ROLES.PRODUCTION]}>
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
        path: "/part-categories",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <PartCategoriesPage />
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
        path: "/part-adjustments",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <PartAdjustmentsPage />
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

    {
        path: "/raw-materials",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <RawMaterialsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/raw-material-movements",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <RawMaterialMovementsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/raw-material-adjustments",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <RawMaterialAdjustmentsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/equipment-parts",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <EquipmentPartsPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/part-cutting-orders",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PRODUCTION]}>
                <DashboardLayout>
                    <PartCuttingOrdersPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/wholesalers",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <WholesalersPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },

    {
        path: "/wholesalers/:clientId",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout>
                    <WholesalerDetailPage />
                </DashboardLayout>
            </ProtectedRoute>
        )
    },
]);


export default router;