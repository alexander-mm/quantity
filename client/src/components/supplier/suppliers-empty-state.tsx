import { Truck } from "lucide-react";

export function SuppliersEmptyState() {

    return (

        <div className="rounded-xl border border-dashed p-12 text-center">

            <Truck
                size={48}
                className="mx-auto text-muted-foreground"
            />

            <h2 className="mt-4 text-xl font-semibold">

                No hay proveedores registrados

            </h2>

            <p className="mt-2 text-muted-foreground">

                Haz clic en "Nuevo proveedor" para crear el primero.

            </p>

        </div>

    );

}