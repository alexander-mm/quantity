import { ArrowLeftRight } from "lucide-react";

export function InventoryMovementsEmptyState() {

    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <ArrowLeftRight
                size={48}
                className="mx-auto text-muted-foreground"
            />
            <h2 className="mt-4 text-xl font-semibold">
                No existen movimientos registrados
            </h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nuevo movimiento" para registrar el primero.
            </p>
        </div>
    );
}