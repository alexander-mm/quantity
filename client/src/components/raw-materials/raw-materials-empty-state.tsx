import { Layers } from "lucide-react";

export function RawMaterialsEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Layers size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No existe materia prima registrada</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nueva materia prima" para registrar la primera lámina, tubo o varilla.
            </p>
        </div>
    );
}
