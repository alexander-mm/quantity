import { Button } from "@/components/ui/button";
import { CuttingOrderStatusBadge } from "./cutting-order-status-badge";
import type { PartCuttingOrder } from "@/types";

type Props = {
    order: PartCuttingOrder;
    onClose: () => void;
};

export function CuttingOrderView({ order, onClose }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Número</p>
                    <p className="font-medium">{order.number}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <CuttingOrderStatusBadge status={order.status} />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Pieza</p>
                    <p>{order.part.code} - {order.part.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Materia prima</p>
                    <p>{order.rawMaterial.code} - {order.rawMaterial.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Materia prima usada</p>
                    <p>{Number(order.rawMaterialQtyUsed)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Piezas estimadas</p>
                    <p>{Number(order.expectedPieces)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Piezas buenas</p>
                    <p>{Number(order.goodPieces)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Piezas dañadas</p>
                    <p>{Number(order.defectivePieces)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p>{new Date(order.cuttingDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Registrado por</p>
                    <p>{order.user.firstName} {order.user.lastName}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Observaciones</p>
                    <p>{order.observations ?? "-"}</p>
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
