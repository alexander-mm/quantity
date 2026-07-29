import { EntityTable } from "@/components/ui";
import type { UnitOfMeasure } from "@/types";

type Props = {
    units: UnitOfMeasure[];
};

export function UnitsOfMeasureTable({ units }: Props) {
    return (
        <EntityTable headers={["Código", "Nombre", "Descripción", "Estado"]}>
            {units.map(unit => (
                <tr key={unit.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{unit.code}</td>
                    <td className="px-6 py-4">{unit.name}</td>
                    <td className="px-6 py-4">{unit.description ?? "-"}</td>
                    <td className="px-6 py-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                unit.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {unit.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
