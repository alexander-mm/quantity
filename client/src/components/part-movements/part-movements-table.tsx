import { Eye } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { PartMovementTypeBadge } from "./part-movement-type-badge";
import type { PartMovement } from "@/types";

type Props = {
    movements: PartMovement[];
    onView: (movement: PartMovement) => void;
};

export function PartMovementsTable({ movements, onView }: Props) {
    return (
        <EntityTable headers={["Número", "Tipo", "Fecha", "Registrado por", "Cantidad", "Acciones"]}>
            {movements.map(movement => (
                <tr key={movement.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{movement.number}</td>
                    <td className="px-6 py-4">
                        <PartMovementTypeBadge type={movement.type} />
                    </td>
                    <td className="px-6 py-4">
                        {new Date(movement.movementDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                        {movement.user.firstName} {movement.user.lastName}
                    </td>
                    <td className="px-6 py-4">
                        {movement.details.reduce((sum, detail) => sum + Number(detail.quantity), 0)}
                    </td>
                    <td className="px-6 py-4">
                        <Eye
                            size={18}
                            className="cursor-pointer text-slate-500 hover:text-primary"
                            onClick={() => onView(movement)}
                        />
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
