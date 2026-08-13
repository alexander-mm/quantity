import { EntityTable } from "@/components/ui";
import type { InventoryAdjustment } from "@/types";

type Props = {
    adjustments: InventoryAdjustment[];
};

export function InventoryAdjustmentsTable({ adjustments }: Props) {
    return (
        <EntityTable
            headers={["Fecha", "Tipo de Ajuste", "Producto", "Bodega", "Cantidad", "Motivo", "Usuario"]}
        >
            {adjustments.map(adjustment => (
                <tr key={adjustment.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">
                        {new Date(adjustment.movementDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                        {adjustment.movementType.code === "ADJUSTMENT_IN" ? "Positivo" : "Negativo"}
                    </td>
                    <td className="px-6 py-4">{adjustment.product.name}</td>
                    <td className="px-6 py-4">{adjustment.store.name}</td>
                    <td className="px-6 py-4">{adjustment.quantity}</td>
                    <td className="px-6 py-4">{adjustment.observations}</td>
                    <td className="px-6 py-4">
                        {adjustment.user.firstName} {adjustment.user.lastName}
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}