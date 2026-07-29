import { Tag } from "lucide-react";

export function BrandsEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Tag size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No existen marcas registradas</h2>
            <p className="mt-2 text-muted-foreground">
                Haz clic en "Nueva marca" para registrar la primera.
            </p>
        </div>
    );
}
