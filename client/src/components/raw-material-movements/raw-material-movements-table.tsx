import { Eye } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { RawMaterialMovementTypeBadge } from "./raw-material-movement-type-badge";
import { formatDateOnly } from "@/lib/format-date";
import type { RawMaterialMovement } from "@/types";

type Props = {
    movements: RawMaterialMovement[];
    onView: (movement: RawMaterialMovement) => void;
};

export function RawMaterialMovementsTable({ movements, onView }: Props) {
    return (
        <EntityTable headers={["Número", "Tipo", "Fecha", "Registrado por", "Acciones"]}>
            {movements.map(movement => (
                <tr key={movement.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{movement.number}</td>
                    <td className="px-6 py-4">
                        <RawMaterialMovementTypeBadge type={movement.type} />
                    </td>
                    <td className="px-6 py-4">
                        {formatDateOnly(movement.movementDate)}
                    </td>
                    <td className="px-6 py-4">
                        {movement.user.firstName} {movement.user.lastName}
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
