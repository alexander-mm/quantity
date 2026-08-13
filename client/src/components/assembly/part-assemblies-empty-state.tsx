import { Boxes } from "lucide-react";

export function PartAssembliesEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Boxes size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No hay ensamblajes de piezas registrados</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Ensamblar pieza" para registrar el primero.
            </p>
        </div>
    );
}