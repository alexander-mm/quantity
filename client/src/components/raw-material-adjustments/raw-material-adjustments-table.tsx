import { EntityTable } from "@/components/ui";
import type { RawMaterialAdjustment } from "@/types";

type Props = {
    adjustments: RawMaterialAdjustment[];
};

export function RawMaterialAdjustmentsTable({ adjustments }: Props) {
    return (
        <EntityTable
            headers={["Fecha", "Tipo de Ajuste", "Materia Prima", "Cantidad", "Motivo", "Usuario"]}
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
                            {detail ? `${detail.rawMaterial.code} - ${detail.rawMaterial.name}` : "-"}
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
