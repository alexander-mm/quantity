import type { PropsWithChildren } from "react";

// Envoltorio compartido de los documentos imprimibles (cotizaciones, cuentas
// de cobro): la franja azul corre de punta a punta de la hoja para que se
// note a simple vista que el diseño ocupa toda la página, sin importar
// cuántos ítems tenga el documento.
export function PrintPage({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-full">
            <div className="w-3 shrink-0 bg-[#0170B8]" />
            <div
                className="flex min-h-full flex-1 flex-col p-10 text-slate-900"
                style={{ fontFamily: "'Wix Madefor Display', sans-serif" }}
            >
                {children}
            </div>
        </div>
    );
}
