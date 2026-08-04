import { useState } from "react";
import type { PropsWithChildren, MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth, useStockTransfers } from "@/hooks";
import { ROLES } from "@/constants/roles";

function navLinkStyle({ isActive }: { isActive: boolean }) {
    return {
        display: "block",
        padding: "5px 0",
        color: "#FFF",
        textDecoration: "none",
        fontWeight: isActive ? "bold" : "normal",
        opacity: isActive ? 1 : 0.85
    };
}

export function DashboardLayout({
    children
}: PropsWithChildren) {

    const { user, logout } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;
    const isProduction = user?.roleName === ROLES.PRODUCTION;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { data: transfersData } = useStockTransfers({ enabled: isAdmin });
    const issuesCount = isAdmin
        ? (transfersData?.data ?? []).filter(t => t.status === "WITH_ISSUES").length
        : 0;
    const closeMenuOnLinkClick = (e: MouseEvent<HTMLElement>) => {
        if ((e.target as HTMLElement).closest("a")) {
            setIsMobileMenuOpen(false);
        }
    };
    const handleLogout = () => {
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
                style={{
                    background: "#0170B8",
                    color: "#FFF"
                }}
            >

                <div
                    className="sticky top-0 z-10 mb-2"
                    style={{
                        background: "#0170B8",
                        padding: "24px 24px 0 24px"
                    }}
                >
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-white/85 hover:opacity-100"
                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                    >
                        <LogOut size={18} />
                        <span className="text-sm text-white/85 truncate">
                           || {user?.firstName} {user?.lastName}
                        </span>
                    </button>
                    <hr className="sticky mt-4" />
                    <button
                        type="button"
                        className="md:hidden absolute right-0 top-1 z-20"
                        aria-label="Cerrar menú"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X color="#FFF" size={30} />
                    </button>
                    <NavLink to="/dashboard" style={navLinkStyle}>
                        <img className="py-2" src="https://www.masqueunefecto.com/wp-content/uploads/2026/07/quantity-logo.png" />
                    </NavLink>
                    <hr className="sticky" />
                </div>

                <div style={{ padding: "0px 24px 24px 24px" }}>
                    {!isProduction && (
                        <>
                            {isAdmin && (
                                <>
                                    <NavLink to="/products" style={navLinkStyle}>Productos</NavLink>
                                </>
                            )}
                            <NavLink to="/clients" style={navLinkStyle}>Clientes</NavLink>
                            {isAdmin && (
                                <>
                                    <NavLink to="/suppliers" style={navLinkStyle}>Proveedores</NavLink>
                                    <NavLink to="/purchases" style={navLinkStyle}>Compras</NavLink>
                                </>
                            )}
                            <NavLink to="/sales" style={navLinkStyle}>Ventas</NavLink>
                            <NavLink to="/inventory-stock" style={navLinkStyle}>Inventario</NavLink>
                            {isAdmin && (
                                <>
                                    <NavLink to="/inventory-movements" style={navLinkStyle}>Movimientos</NavLink>
                                    <NavLink to="/inventory-adjustments" style={navLinkStyle}>Ajustes</NavLink>
                                </>
                            )}
                            <NavLink to="/kardex" style={navLinkStyle}>Kardex</NavLink>
                            <NavLink to="/pending-receptions" style={navLinkStyle}>Recepciones pendientes</NavLink>
                            <NavLink to="/stock-transfers" style={navLinkStyle}>Envíos</NavLink>
                        </>
                    )}

                    {(isAdmin || isProduction) && (
                        <>
                            <hr style={{ margin: "16px 0", opacity: 0.3 }} />
                            <NavLink to="/parts" style={navLinkStyle}>Piezas</NavLink>
                            <NavLink to="/part-movements" style={navLinkStyle}>Movimientos de Piezas</NavLink>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <hr style={{ margin: "16px 0", opacity: 0.3 }} />
                            <NavLink to="/transfer-issues" style={navLinkStyle}>
                                Novedades de Transferencias{issuesCount > 0 ? ` (${issuesCount})` : ""}
                            </NavLink>
                            <NavLink to="/roles" style={navLinkStyle}>Roles</NavLink>
                            <NavLink to="/users" style={navLinkStyle}>Usuarios</NavLink>
                            <NavLink to="/stores" style={navLinkStyle}>Tiendas</NavLink>
                            <NavLink to="/brands" className="mt-4" style={navLinkStyle} >
                                Marcas
                            </NavLink>
                            <NavLink to="/categories" style={navLinkStyle}>Categorías</NavLink>
                            <NavLink to="/units-of-measure" style={navLinkStyle}>Unidades de Medida</NavLink>
                            <NavLink to="/margin-profiles" style={navLinkStyle}>Perfiles de Descuento</NavLink>

                        </>
                    )}
                </div>



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
                        <Menu size={24} color="#0170B8" />
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