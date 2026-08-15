import { SlidersHorizontal } from "lucide-react";

export function RawMaterialAdjustmentsEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <SlidersHorizontal size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No existen ajustes registrados</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nuevo ajuste" para registrar el primero.
            </p>
        </div>
    );
}
