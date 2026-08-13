import { Eye } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { InventoryMovement } from "@/types";

type Props = {
    movements: InventoryMovement[];
    onView: (movement: InventoryMovement) => void;
};

export function InventoryMovementsTable({
    movements,
    onView
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
                ""
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

                            <Eye
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onView(movement)}
                            />

                        </td>

                    </tr>

                ))
            }

        </EntityTable>

    );

}