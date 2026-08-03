import { Users } from "lucide-react";

export function ClientsEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Users size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No existen clientes registrados</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nuevo cliente" para registrar el primero.
            </p>
        </div>
    );
}
