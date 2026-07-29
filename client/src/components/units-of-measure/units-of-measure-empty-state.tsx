import { Ruler } from "lucide-react";

export function UnitsOfMeasureEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Ruler size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No existen unidades de medida registradas</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nueva unidad" para registrar la primera.
            </p>
        </div>
    );
}
