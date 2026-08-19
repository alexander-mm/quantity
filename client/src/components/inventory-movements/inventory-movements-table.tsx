import { Eye, Pencil, Check, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { InventoryMovementStatusBadge } from "./inventory-movement-status-badge";
import type { InventoryMovement } from "@/types";

type Props = {
    movements: InventoryMovement[];
    onView: (movement: InventoryMovement) => void;
    onEdit: (movement: InventoryMovement) => void;
    onConfirm: (movement: InventoryMovement) => void;
    onCancel: (movement: InventoryMovement) => void;
};

export function InventoryMovementsTable({
    movements,
    onView,
    onEdit,
    onConfirm,
    onCancel
}: Props) {

    return (

        <EntityTable
            headers={[
                "Fecha",
                "Tipo de Movimiento",
                "Bodega",
                "Producto",
                "Cantidad",
                "Costo",
                "Usuario",
                "Estado",
                "Acciones"
            ]}
        >

            {
                movements.map(movement => (

                    <tr
                        key={movement.id}
                        className="border-b transition hover:bg-muted/40"
                    >

                        <td className="px-6 py-4">
                            {new Date(
                                movement.movementDate
                            ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4">
                            {movement.movementType.name}
                        </td>

                        <td className="px-6 py-4">
                            {movement.store.name}
                        </td>

                        <td className="px-6 py-4">
                            {movement.product.name}
                        </td>

                        <td className="px-6 py-4">
                            {movement.quantity}
                        </td>

                        <td className="px-6 py-4">
                            ${Number(
                                movement.unitCost
                            ).toLocaleString()}
                        </td>

                        <td className="px-6 py-4">
                            {movement.user.firstName}{" "}
                            {movement.user.lastName}
                        </td>

                        <td className="px-6 py-4">
                            <InventoryMovementStatusBadge status={movement.status} />
                        </td>

                        <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                                <Eye
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
                                    onClick={() => onView(movement)}
                                />

                                {movement.status === "DRAFT" && (
                                    <Pencil
                                        size={18}
                                        className="cursor-pointer text-slate-500 hover:text-primary"
                                        onClick={() => onEdit(movement)}
                                    />
                                )}

                                {movement.status === "DRAFT" && (
                                    <Check
                                        size={18}
                                        className="cursor-pointer text-green-600 hover:text-green-700"
                                        onClick={() => onConfirm(movement)}
                                    />
                                )}

                                {movement.status === "DRAFT" && (
                                    <Trash2
                                        size={18}
                                        className="cursor-pointer text-red-600 hover:text-red-700"
                                        onClick={() => onCancel(movement)}
                                    />
                                )}

                            </div>

                        </td>

                    </tr>

                ))
            }

        </EntityTable>

    );

}