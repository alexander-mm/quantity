import { Store as StoreIcon } from "lucide-react";

export function StoresEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <StoreIcon size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No existen tiendas registradas</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nueva tienda" para registrar la primera.
            </p>
        </div>
    );
}
