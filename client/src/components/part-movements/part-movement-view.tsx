import { Button } from "@/components/ui/button";
import { PartMovementTypeBadge } from "./part-movement-type-badge";
import type { PartMovement } from "@/types";

type Props = {
    movement: PartMovement;
    onClose: () => void;
};

export function PartMovementView({ movement, onClose }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Número</p>
                    <p className="font-medium">{movement.number}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <PartMovementTypeBadge type={movement.type} />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p>{new Date(movement.movementDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Registrado por</p>
                    <p>{movement.user.firstName} {movement.user.lastName}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Observaciones</p>
                    <p>{movement.observations ?? "-"}</p>
                </div>
            </div>

            <table className="w-full border rounded-lg">
                <thead>
                    <tr className="border-b bg-muted">
                        <th className="p-2 text-left">Pieza</th>
                        <th className="p-2">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {movement.details.map(detail => (
                        <tr key={detail.id} className="border-b">
                            <td className="p-2">{detail.part.code} - {detail.part.name}</td>
                            <td className="p-2 text-center">{Number(detail.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </div>
    );
}
