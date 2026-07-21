import { Package } from "lucide-react";

export function ProductsEmptyState() {

    return (

        <div className="rounded-xl border border-dashed p-12 text-center">

            <Package
                size={48}
                className="mx-auto text-muted-foreground"
            />

            <h2 className="mt-4 text-xl font-semibold">

                No hay productos registrados

            </h2>

            <p className="mt-2 text-muted-foreground">

                Haz clic en "Nuevo producto" para crear el primero.

            </p>

        </div>

    );

}