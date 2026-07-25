import { TriangleAlert } from "lucide-react";

export function SuppliersErrorState() {

    return (

        <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">

            <TriangleAlert
                size={42}
                className="mx-auto text-red-500"
            />

            <h2 className="mt-4 text-xl font-semibold">

                Error al cargar proveedores

            </h2>

            <p className="mt-2 text-muted-foreground">

                Intenta nuevamente.

            </p>

        </div>

    );

}