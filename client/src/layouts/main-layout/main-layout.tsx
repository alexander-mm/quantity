import type { PropsWithChildren } from "react";

export function MainLayout({

    children

}: PropsWithChildren) {

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column"
            }}
        >

            <header
                style={{
                    padding: "16px 24px",
                    background: "#0170B8",
                    color: "#FFFFFF",
                    fontWeight: 600
                }}
            >
                ORDEPLUS ERP
            </header>

            <main
                style={{
                    flex: 1,
                    padding: "24px"
                }}
            >
                {children}
            </main>

        </div>

    );

}