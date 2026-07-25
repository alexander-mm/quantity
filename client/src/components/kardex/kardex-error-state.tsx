import { AlertTriangle } from "lucide-react";

export function KardexErrorState() {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center">
            <AlertTriangle
                size={48}
                className="mx-auto text-red-500"
            />
            <h2 className="mt-4 text-xl font-semibold text-red-600">
                Error al cargar el Kardex
            </h2>
            <p className="mt-2 text-red-500">
                Intente nuevamente en unos segundos.
            </p>
        </div>
    );
}