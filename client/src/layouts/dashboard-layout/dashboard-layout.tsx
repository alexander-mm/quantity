import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ROLES } from "@/constants/roles";

function navLinkStyle({ isActive }: { isActive: boolean }) {
    return {
        display: "block",
        padding: "8px 0",
        color: "#FFF",
        textDecoration: "none",
        fontWeight: isActive ? "bold" : "normal",
        opacity: isActive ? 1 : 0.85
    };
}

export function DashboardLayout({
    children
}: PropsWithChildren) {

    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "260px 1fr",
                minHeight: "100vh"
            }}
        >
            <aside
                style={{
                    background: "#0170B8",
                    color: "#FFF",
                    padding: "24px"
                }}
            >
                <div className="mb-6">
                    <img src="https://www.masqueunefecto.com/wp-content/uploads/2026/07/quantity-logo.png"/>
                </div>

                <hr />
                <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
                <NavLink to="/products" style={navLinkStyle}>Productos</NavLink>
                <p style={{ opacity: 0.5 }}>Clientes</p>
                <NavLink to="/suppliers" style={navLinkStyle}>Proveedores</NavLink>
                <NavLink to="/purchases" style={navLinkStyle}>Compras</NavLink>
                <NavLink to="/sales" style={navLinkStyle}>Ventas</NavLink>
                <NavLink to="/inventory-stock" style={navLinkStyle}>Inventario</NavLink>
                <NavLink to="/inventory-movements" style={navLinkStyle}>Movimientos</NavLink>
                <NavLink to="/inventory-adjustments" style={navLinkStyle}>Ajustes</NavLink>
                <NavLink to="/kardex" style={navLinkStyle}>Kardex</NavLink>

                {isAdmin && (
                    <>
                        <hr style={{ margin: "16px 0", opacity: 0.3 }} />
                        <NavLink to="/roles" style={navLinkStyle}>Roles</NavLink>
                        <NavLink to="/users" style={navLinkStyle}>Usuarios</NavLink>
                        <NavLink to="/stores" style={navLinkStyle}>Tiendas</NavLink>
                        <NavLink to="/brands" style={navLinkStyle}>Marcas</NavLink>
                        <NavLink to="/categories" style={navLinkStyle}>Categorías</NavLink>
                        <NavLink to="/units-of-measure" style={navLinkStyle}>Unidades de Medida</NavLink>
                        <NavLink to="/margin-profiles" style={navLinkStyle}>Perfiles de Margen</NavLink>
                    </>
                )}
            </aside>

            <div>
                <header
                    style={{
                        padding: "20px",
                        borderBottom: "1px solid #E5E7EB"
                    }}
                >
                    <div className="w-60">
                        <img src="https://www.masqueunefecto.com/wp-content/uploads/2026/07/ordeplus-logo-blue.png"/>
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