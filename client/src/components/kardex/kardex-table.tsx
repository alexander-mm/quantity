import { EntityTable } from "@/components/ui";
import type { KardexMovement } from "@/types";

type Props = {
    movements: KardexMovement[];
};

export function KardexTable({
    movements
}: Props) {

    return (
        <EntityTable
            headers={[
                "Fecha",
                "Movimiento",
                "Entrada",
                "Salida",
                "Saldo",
                "Costo",
                "Usuario",
                "Observaciones"
            ]}
        >
            {
                movements.map((movement, index) => {

                    const quantity = Number(
                        movement.quantity
                    );
                    const balance = movements
                        .slice(0, index + 1)
                        .reduce((total, item) => {

                            const qty = Number(item.quantity);

                            if (item.movementType.stockOperation === "IN") {
                                return total + qty;
                            }

                            if (item.movementType.stockOperation === "OUT") {
                                return total - qty;
                            }

                            return total;

                        }, 0);

                    return (
                        <tr
                            key={movement.id}
                            className="border-b transition hover:bg-muted/40"
                        >
                            <td className="px-6 py-4">
                                {
                                    new Date(
                                        movement.movementDate
                                    ).toLocaleDateString()
                                }
                            </td>

                            <td className="px-6 py-4">
                                {movement.movementType.name}
                            </td>

                            <td className="px-6 py-4">
                                {
                                    movement.movementType.stockOperation === "IN"
                                        ? quantity
                                        : "-"
                                }
                            </td>

                            <td className="px-6 py-4">
                                {
                                    movement.movementType.stockOperation === "OUT"
                                        ? quantity
                                        : "-"
                                }
                            </td>

                            <td className="px-6 py-4 font-semibold">
                                {balance}
                            </td>

                            <td className="px-6 py-4">
                                ${Number(
                                    movement.unitCost
                                ).toFixed(2)}
                            </td>

                            <td className="px-6 py-4">
                                {movement.user.firstName}{" "}
                                {movement.user.lastName}
                            </td>

                            <td className="px-6 py-4">
                                {movement.observations ?? "-"}
                            </td>

                        </tr>
                    );

                })
            }
        </EntityTable>
    );

}