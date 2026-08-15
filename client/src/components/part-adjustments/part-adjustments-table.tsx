import { EntityTable } from "@/components/ui";
import type { PartAdjustment } from "@/types";

type Props = {
    adjustments: PartAdjustment[];
};

export function PartAdjustmentsTable({ adjustments }: Props) {
    return (
        <EntityTable
            headers={["Fecha", "Tipo de Ajuste", "Pieza", "Cantidad", "Motivo", "Usuario"]}
        >
            {adjustments.map(adjustment => {

                const detail = adjustment.details[0];

                return (
                    <tr key={adjustment.id} className="border-b transition hover:bg-muted/40">
                        <td className="px-6 py-4">
                            {new Date(adjustment.movementDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                            {adjustment.type === "IN" ? "Positivo" : "Negativo"}
                        </td>
                        <td className="px-6 py-4">
                            {detail ? `${detail.part.code} - ${detail.part.name}` : "-"}
                        </td>
                        <td className="px-6 py-4">{detail?.quantity ?? "-"}</td>
                        <td className="px-6 py-4">{adjustment.observations}</td>
                        <td className="px-6 py-4">
                            {adjustment.user.firstName} {adjustment.user.lastName}
                        </td>
                    </tr>
                );

            })}
        </EntityTable>
    );
}
