import { Button } from "@/components/ui/button";
import type { Supplier } from "@/types";

type Props = {
    supplier: Supplier;
    onClose: () => void;
};

export function SupplierView({ supplier, onClose }: Props) {

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="font-medium">{supplier.code}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Razón social</p>
                    <p className="font-medium">{supplier.companyName}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Contacto</p>
                    <p>{supplier.contactName ?? "-"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">RUC/CC</p>
                    <p>{supplier.taxId ?? "-"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p>{supplier.phone ?? "-"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Correo</p>
                    <p>{supplier.email ?? "-"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p>{supplier.address ?? "-"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Ciudad</p>
                    <p>{supplier.city ?? "-"}</p>
                </div>

                <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Observaciones</p>
                    <p>{supplier.observations ?? "-"}</p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </div>
    );
}
