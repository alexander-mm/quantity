import { useState } from "react";
import type { PropsWithChildren, MouseEvent, ComponentType } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Menu,
    X,
    LogOut,
    ChevronDown,
    ShoppingCart,
    Truck,
    Tags,
    Warehouse,
    ArrowLeftRight,
    Factory,
    Settings
} from "lucide-react";
import { useAuth, useStockTransfers, useOutboxPendingCount } from "@/hooks";
import { ROLES } from "@/constants/roles";
import { authService } from "@/services";

const BRAND_BLUE = "#0170B8";

function navItemClassName({ isActive }: { isActive: boolean }) {
    return [
        "block rounded-md py-1.5 px-2.5 text-sm md:text-base transition-colors",
        isActive
            ? "bg-white/15 font-semibold text-white"
            : "font-normal text-white/75 hover:bg-white/10 hover:text-white"
    ].join(" ");
}

type Visibility = "nonProduction" | "adminOnly" | "adminOrProduction";

type NavItem = {
    to: string;
    label: string;
    visibility: Visibility;
    badge?: number;
};

type NavGroup = {
    key: string;
    label: string;
    icon: ComponentType<{ size?: number; className?: string }>;
    items: NavItem[];
};

function Badge({ count }: { count: number }) {
    if (count <= 0) {
        return null;
    }
    return (
        <span
            className="inline-flex items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[11px] font-semibold leading-none"
            style={{ color: BRAND_BLUE }}
        >
            {count}
        </span>
    );
}

export function DashboardLayout({
    children
}: PropsWithChildren) {

    const { user, refreshToken, logout } = useAuth();
    const location = useLocation();
    const isAdmin = user?.roleName === ROLES.ADMIN;
    const isProduction = user?.roleName === ROLES.PRODUCTION;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { data: transfersData } = useStockTransfers({ enabled: !isProduction });
    const transfers = transfersData?.data ?? [];
    const issues = transfers.filter(t => t.status === "WITH_ISSUES");
    const issuesCount = isAdmin
        ? issues.length
        : issues.filter(t =>
            (t.destType === "STORE" && t.destStore?.id === user?.storeId) ||
            (t.destType === "TECHNICIAN" && t.destUser?.id === user?.id)
        ).length;
    const pendingReceptionsCount = !isProduction
        ? transfers.filter(t =>
            t.status === "PENDING" &&
            (
                (t.destType === "STORE" && t.destStore?.id === user?.storeId) ||
                (t.destType === "TECHNICIAN" && t.destUser?.id === user?.id)
            )
        ).length
        : 0;

    const pendingSyncSalesCount = useOutboxPendingCount("sale");

    const groups: NavGroup[] = [
        {
            key: "ventas",
            label: "Ventas",
            icon: ShoppingCart,
            items: [
                { to: "/clients", label: "Admin. de Clientes", visibility: "nonProduction" },
                { to: "/sales", label: "Ventas", visibility: "nonProduction" },
                { to: "/pending-sync", label: "Mis pendientes", visibility: "nonProduction", badge: pendingSyncSalesCount },
                { to: "/returns", label: "Devoluciones", visibility: "nonProduction" },
                { to: "/wholesalers", label: "Admin. de Mayoristas", visibility: "adminOnly" }
            ]
        },
        {
            key: "compras",
            label: "Compras",
            icon: Truck,
            items: [
                { to: "/suppliers", label: "Proveedores", visibility: "adminOnly" },
                { to: "/purchases", label: "Compras", visibility: "adminOnly" }
            ]
        },
        {
            key: "catalogo",
            label: "Catálogo",
            icon: Tags,
            items: [
                { to: "/products", label: "Admin. de Productos", visibility: "adminOnly" },
                { to: "/brands", label: "Marcas", visibility: "adminOnly" },
                { to: "/categories", label: "Categorías", visibility: "adminOnly" },
                { to: "/units-of-measure", label: "Unidades de Medida", visibility: "adminOnly" },
                { to: "/margin-profiles", label: "Perfiles de Descuento", visibility: "adminOnly" }
            ]
        },
        {
            key: "inventario",
            label: "Inventario",
            icon: Warehouse,
            items: [
                { to: "/inventory-stock", label: "Admin. de Inventario", visibility: "nonProduction" },
                { to: "/inventory-movements", label: "Movimientos", visibility: "adminOnly" },
                { to: "/inventory-adjustments", label: "Ajustes", visibility: "adminOnly" },
                { to: "/kardex", label: "Kardex", visibility: "nonProduction" }
            ]
        },
        {
            key: "transferencias",
            label: "Transferencias",
            icon: ArrowLeftRight,
            items: [
                { to: "/stock-transfers", label: "Admin. de Envíos", visibility: "nonProduction" },
                {
                    to: "/pending-receptions",
                    label: "Recepciones pendientes",
                    visibility: "nonProduction",
                    badge: pendingReceptionsCount
                },
                {
                    to: "/transfer-issues",
                    label: "Novedades",
                    visibility: "nonProduction",
                    badge: issuesCount
                }
            ]
        },
        {
            key: "produccion",
            label: "Producción",
            icon: Factory,
            items: [
                { to: "/parts", label: "Admin. de Piezas", visibility: "adminOrProduction" },
                { to: "/part-movements", label: "Movimientos de Piezas", visibility: "adminOrProduction" },
                { to: "/part-adjustments", label: "Ajustes de Piezas", visibility: "adminOrProduction" },
                { to: "/raw-materials", label: "Admin. de M. Prima", visibility: "adminOrProduction" },
                { to: "/raw-material-movements", label: "Movimientos de M. Prima", visibility: "adminOrProduction" },
                { to: "/raw-material-adjustments", label: "Ajustes de M. Prima", visibility: "adminOrProduction" },
                { to: "/part-recipes", label: "Recetas de Corte", visibility: "adminOrProduction" },
                { to: "/part-cutting-orders", label: "Órdenes de Corte", visibility: "adminOrProduction" },
                { to: "/equipment-parts", label: "Cálculo de Producción", visibility: "adminOrProduction" },
                { to: "/assembly", label: "Ensamblaje", visibility: "adminOrProduction" }
            ]
        },
        {
            key: "administracion",
            label: "Administración",
            icon: Settings,
            items: [
                { to: "/roles", label: "Roles", visibility: "adminOnly" },
                { to: "/users", label: "Usuarios", visibility: "adminOnly" },
                { to: "/stores", label: "Tiendas", visibility: "adminOnly" }
            ]
        }
    ];

    const canSee = (visibility: Visibility) => {
        if (visibility === "nonProduction") return !isProduction;
        if (visibility === "adminOnly") return isAdmin;
        return isAdmin || isProduction;
    };

    const visibleGroups = groups
        .map(group => ({
            ...group,
            items: group.items.filter(item => canSee(item.visibility))
        }))
        .filter(group => group.items.length > 0);

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
        const activeGroup = visibleGroups.find(group =>
            group.items.some(item => location.pathname.startsWith(item.to))
        );
        return activeGroup ? { [activeGroup.key]: true } : {};
    });

    const toggleGroup = (key: string) => {
        setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const closeMenuOnLinkClick = (e: MouseEvent<HTMLElement>) => {
        if ((e.target as HTMLElement).closest("a")) {
            setIsMobileMenuOpen(false);
        }
    };
    const handleLogout = () => {
        if (refreshToken) {
            void authService.logout(refreshToken);
        }
        logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside
                onClick={closeMenuOnLinkClick}
                className={`fixed inset-y-0 left-0 z-50 w-65 overflow-y-auto overscroll-contain transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{ background: BRAND_BLUE }}
            >

                <div
                    className="sticky top-0 z-10"
                    style={{
                        background: BRAND_BLUE,
                        padding: "20px 24px"
                    }}
                >
                    <NavLink to="/dashboard" className="block">
                        <img className="py-1" src="https://www.masqueunefecto.com/wp-content/uploads/2026/07/quantity-logo.png" />
                    </NavLink>

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-white/85 hover:opacity-100"
                            style={{ background: "transparent", border: "none", cursor: "pointer" }}
                        >
                            <LogOut size={16} />
                            <span className="text-sm md:text-base text-white/85 truncate">
                                {user?.firstName} {user?.lastName}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="md:hidden"
                            aria-label="Cerrar menú"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X color="#FFF" size={22} />
                        </button>
                    </div>
                </div>

                <nav className="px-3 py-4">
                    {visibleGroups.map(group => {

                        const isOpen = !!openGroups[group.key];
                        const groupBadge = group.items.reduce((sum, item) => sum + (item.badge ?? 0), 0);
                        const GroupIcon = group.icon;

                        return (
                            <div key={group.key} className="mb-1">
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(group.key)}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm md:text-base font-medium text-white/90 transition-colors hover:bg-white/10"
                                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                                    aria-expanded={isOpen}
                                >
                                    <GroupIcon size={18} className="shrink-0 text-white/70" />
                                    <span className="flex-1 truncate">{group.label}</span>
                                    <Badge count={groupBadge} />
                                    <ChevronDown
                                        size={16}
                                        className={`shrink-0 text-white/70 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="mt-0.5 mb-1.5 flex flex-col gap-0.5 border-l border-white/20 pl-3">
                                        {group.items.map(item => (
                                            <NavLink key={item.to} to={item.to} className={navItemClassName}>
                                                <span className="flex items-center justify-between gap-2">
                                                    <span className="truncate">{item.label}</span>
                                                    <Badge count={item.badge ?? 0} />
                                                </span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );

                    })}
                </nav>

            </aside>

            <div>
                <header
                    style={{
                        padding: "20px",
                        borderBottom: "1px solid #E5E7EB"
                    }}
                    className="flex items-center gap-4"
                >
                    <button
                        type="button"
                        className="md:hidden"
                        aria-label="Abrir menú"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} color={BRAND_BLUE} />
                    </button>

                    <div className="w-60">
                        <img src="https://www.masqueunefecto.com/wp-content/uploads/2026/07/ordeplus-logo-blue.png" />
                    </div>
                </header>

                <main
                    style={{
                        padding: "24px"
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
