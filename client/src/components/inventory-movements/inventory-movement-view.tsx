import { Button } from "@/components/ui/button";
import type { InventoryMovement } from "@/types";

type Props = {
    movement: InventoryMovement;
    onClose: () => void;
};

function getClientLabel(client: InventoryMovement["client"]) {
    if (!client) {
        return null;
    }
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || null);
}

export function InventoryMovementView({ movement, onClose }: Props) {

    const clientLabel = getClientLabel(movement.client);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Movimiento</p>
                    <p className="font-medium">{movement.movementType.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p>{new Date(movement.movementDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Producto</p>
                    <p>{movement.product.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Bodega</p>
                    <p>{movement.store.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Cantidad</p>
                    <p>{movement.quantity}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Costo unitario</p>
                    <p>${Number(movement.unitCost).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Registrado por</p>
                    <p>{movement.user.firstName} {movement.user.lastName}</p>
                </div>
                {clientLabel && (
                    <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <p>{clientLabel}</p>
                    </div>
                )}
                <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Observaciones</p>
                    <p>{movement.observations ?? "-"}</p>
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
