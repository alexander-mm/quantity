import { Landmark } from "lucide-react";

export function WholesalersEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <Landmark size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No hay mayoristas registrados</h2>
            <p className="mt-2 text-muted-foreground">
                Marca un cliente como "Es mayorista" en su formulario para que aparezca aquí.
            </p>
        </div>
    );
}
