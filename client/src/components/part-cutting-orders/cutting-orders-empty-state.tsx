import { Scissors } from "lucide-react";

export function CuttingOrdersEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Scissors size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No hay órdenes de corte registradas</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Registrar orden de corte" para descontar materia prima y producir piezas.
            </p>
        </div>
    );
}
