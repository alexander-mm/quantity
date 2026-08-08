import { AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { RawMaterial } from "@/types";

function isLowStock(item: RawMaterial): boolean {
    return Number(item.minimumStock) > 0 && Number(item.quantity) <= Number(item.minimumStock);
}

type Props = {
    rawMaterials: RawMaterial[];
    onEdit: (rawMaterial: RawMaterial) => void;
    onDelete: (rawMaterial: RawMaterial) => void;
};

const SHAPE_LABELS: Record<RawMaterial["shape"], string> = {
    SHEET: "Lámina",
    TUBE: "Tubo",
    ROD: "Varilla"
};

function formatDimensions(item: RawMaterial): string {

    if (item.shape === "SHEET") {
        return `${Number(item.width)} x ${Number(item.height)} x ${Number(item.thickness)}`;
    }

    if (item.shape === "ROD") {
        return `${Number(item.length)} m (calibre ${Number(item.thickness)})`;
    }

    const profileLabel = item.profile === "ROUND" ? "Ø" : item.profile === "RECTANGULAR" ? "▭" : "□";

    return `${profileLabel} ${Number(item.width)}${item.height ? ` x ${Number(item.height)}` : ""} - ${Number(item.length)} (esp. ${Number(item.thickness)})`;

}

export function RawMaterialsTable({ rawMaterials, onEdit, onDelete }: Props) {
    return (
        <EntityTable headers={["Código", "Nombre", "Forma", "Material", "Medidas", "Stock", "Estado", "Acciones"]}>
            {rawMaterials.map(item => (
                <tr key={item.id} className={`border-b transition hover:bg-muted/40 ${isLowStock(item) ? "bg-amber-50" : ""}`}>
                    <td className="px-6 py-4 font-medium">{item.code}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{SHAPE_LABELS[item.shape]}</td>
                    <td className="px-6 py-4">{item.material}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDimensions(item)}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                            {Number(item.quantity)}
                            {isLowStock(item) && (
                                <AlertTriangle size={15} className="text-amber-600" />
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                item.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {item.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Pencil
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onEdit(item)}
                            />
                            <Trash2
                                size={18}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => onDelete(item)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
