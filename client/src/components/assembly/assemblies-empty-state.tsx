import { Boxes } from "lucide-react";

export function AssembliesEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Boxes size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No hay ensamblajes registrados</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Ensamblar producto" para registrar el primero.
            </p>
        </div>
    );
}
