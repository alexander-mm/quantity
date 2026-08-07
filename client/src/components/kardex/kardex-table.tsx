import { EntityTable } from "@/components/ui";
import type { KardexMovement } from "@/types";

type Props = {
    movements: KardexMovement[];
    currentStock: number;
};

function getClientLabel(client: KardexMovement["client"]) {
    if (!client) {
        return "-";
    }
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || "-");
}

function getDelta(movement: KardexMovement): number {

    const qty = Number(movement.quantity);

    if (movement.movementType.stockOperation === "IN") {
        return qty;
    }

    if (movement.movementType.stockOperation === "OUT") {
        return -qty;
    }

    return 0;

}

export function KardexTable({
    movements,
    currentStock
}: Props) {

    // El saldo se ancla al stock real actual (fuente de verdad) y se reconstruye
    // hacia atrás, en vez de asumir que la lista de movimientos arranca en cero.
    // Así se evita mostrar saldos negativos por movimientos inactivos/no listados.
    const totalDelta = movements.reduce(
        (total, movement) => total + getDelta(movement),
        0
    );

    const initialBalance = currentStock - totalDelta;

    const balances = movements.reduce<number[]>((acc, movement) => {
        const previous = acc.length > 0 ? acc[acc.length - 1] : initialBalance;
        acc.push(previous + getDelta(movement));
        return acc;
    }, []);

    return (
        <EntityTable
            headers={[
                "Fecha",
                "Movimiento",
                "Entrada",
                "Salida",
                "StockDisponible",
                "Costo",
                "Cliente",
                "Usuario",
                "Observaciones"
            ]}
        >
            {
                movements.map((movement, index) => {

                    const quantity = Number(
                        movement.quantity
                    );

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
                                {balances[index]}
                            </td>

                            <td className="px-6 py-4">
                                ${Number(
                                    movement.unitCost
                                ).toFixed(2)}
                            </td>

                            <td className="px-6 py-4">
                                {getClientLabel(movement.client)}
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
