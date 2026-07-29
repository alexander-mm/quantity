import { UserCog } from "lucide-react";

export function UsersEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <UserCog size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No existen usuarios registrados</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nuevo usuario" para registrar el primero.
            </p>
        </div>
    );
}
