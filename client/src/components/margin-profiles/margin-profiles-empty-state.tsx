import { Percent } from "lucide-react";

export function MarginProfilesEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Percent size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No existen perfiles de margen registrados</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nuevo perfil" para registrar el primero.
            </p>
        </div>
    );
}
