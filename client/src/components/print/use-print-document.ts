// Dispara la impresión de un documento A4 (cotizaciones, cuentas de cobro).
// Se inyecta una hoja de estilo temporal en <head> en vez de usar una regla
// @media print fija en el CSS global: así conviven sin pisarse con la @page
// de 38mm x 31mm que ya usa la impresión de etiquetas de producto (ver
// app/providers/print-label-provider.tsx) — ambas reglas @page compiten por
// el mismo contexto de impresión si están declaradas al mismo tiempo.
export function usePrintDocument() {

    const print = (elementId: string) => {

        const style = document.createElement("style");

        style.textContent = `
            @media print {
                @page { size: A4; margin: 15mm; }
                body * { visibility: hidden; }
                #${elementId}, #${elementId} * { visibility: visible; }
                #${elementId} {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    /* A4 (297mm) menos los 15mm de margen superior e inferior del
                       @page: alto real del área imprimible. "vh" no sirve acá —
                       en el contexto de impresión no representa el alto de la
                       hoja de forma confiable entre navegadores. */
                    min-height: 267mm;
                }
                /* Los navegadores no imprimen colores de fondo por defecto salvo
                   que el usuario active "Gráficos de fondo" en el diálogo de
                   impresión — esto fuerza a que sí se impriman (franja lateral,
                   línea del membrete, etc.) sin depender de esa opción. */
                #${elementId}, #${elementId} * {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `;

        document.head.appendChild(style);

        const cleanup = () => {
            style.remove();
            window.removeEventListener("afterprint", cleanup);
        };

        window.addEventListener("afterprint", cleanup);

        setTimeout(() => window.print(), 150);

    };

    return { print };

}
