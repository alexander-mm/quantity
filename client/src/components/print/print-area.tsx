import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type Props = PropsWithChildren<{
    id: string;
}>;

// Contenedor oculto en pantalla que solo se muestra durante la impresión (ver
// use-print-document.ts, que agrega la regla que oculta el resto de la
// página al imprimir). Se monta directo en <body> vía portal: si quedara
// dentro del modal (DialogContent usa position:fixed + overflow-y-auto con
// una altura máxima), ese modal pasaría a ser el contenedor del área de
// impresión (que usa position:absolute) y recortaría cualquier documento más
// alto que esa altura máxima en vez de dejarlo fluir a la hoja completa.
export function PrintArea({ id, children }: Props) {
    return createPortal(
        <div id={id} className="hidden print:block">
            {children}
        </div>,
        document.body
    );
}
