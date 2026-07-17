import type { PropsWithChildren } from "react";

export function DashboardLayout({

    children

}: PropsWithChildren) {

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

                <h2>ORDEPLUS</h2>

                <hr />

                <p>Dashboard</p>

                <p>Productos</p>

                <p>Clientes</p>

                <p>Inventario</p>

            </aside>

            <div>

                <header
                    style={{
                        padding: "20px",
                        borderBottom: "1px solid #E5E7EB"
                    }}
                >

                    ERP ORDEPLUS

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