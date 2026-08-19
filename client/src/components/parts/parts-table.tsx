import { AlertTriangle, Eye, Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Part } from "@/types";

type Props = {
    parts: Part[];
    onView: (part: Part) => void;
    onEdit: (part: Part) => void;
    onDelete: (part: Part) => void;
};

function isLowStock(part: Part): boolean {
    return Number(part.minimumStock) > 0 && Number(part.quantity) <= Number(part.minimumStock);
}

export function PartsTable({ parts, onView, onEdit, onDelete }: Props) {
    return (
        <EntityTable headers={["Código", "Nombre", "Categoría", "Cantidad", "Acciones"]}>
            {parts.map(part => (
                <tr key={part.id} className={`border-b transition hover:bg-muted/40 ${isLowStock(part) ? "bg-amber-50" : ""}`}>
                    <td className="px-6 py-4 font-medium">{part.code}</td>
                    <td className="px-6 py-4">{part.name}</td>
                    <td className="px-6 py-4">{part.category?.name ?? "-"}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                            {Number(part.quantity)}
                            {isLowStock(part) && (
                                <AlertTriangle size={15} className="text-amber-600" />
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Eye
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onView(part)}
                            />
                            <Pencil
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onEdit(part)}
                            />
                            <Trash2
                                size={18}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => onDelete(part)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
