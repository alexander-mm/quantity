import { FileSearch } from "lucide-react";

export function KardexEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <FileSearch
                size={48}
                className="mx-auto text-muted-foreground"
            />
            <h2 className="mt-4 text-xl font-semibold">
                No existen movimientos
            </h2>
            <p className="mt-2 text-muted-foreground">
                Seleccione un producto y una bodega para consultar el Kardex.
            </p>
        </div>
    );
}