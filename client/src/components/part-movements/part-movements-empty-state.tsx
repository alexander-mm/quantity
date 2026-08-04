import { PackageSearch } from "lucide-react";

export function PartMovementsEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <PackageSearch size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No hay movimientos registrados</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Registrar movimiento" para cargar o descargar piezas.
            </p>
        </div>
    );
}
