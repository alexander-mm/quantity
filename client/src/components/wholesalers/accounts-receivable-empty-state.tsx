import { FileSearch } from "lucide-react";

export function AccountsReceivableEmptyState() {
    return (
        <div className="rounded-xl border border-dashed p-12 text-center">
            <FileSearch size={48} className="mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No hay cuentas de cobro</h2>
            <p className="mt-2 text-muted-foreground">
                Se crean automáticamente al registrar una venta a crédito para este mayorista.
            </p>
        </div>
    );
}
