import { Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Part } from "@/types";

type Props = {
    parts: Part[];
    onEdit: (part: Part) => void;
    onDelete: (part: Part) => void;
};

export function PartsTable({ parts, onEdit, onDelete }: Props) {
    return (
        <EntityTable headers={["Código", "Nombre", "Cantidad", "Estado", "Acciones"]}>
            {parts.map(part => (
                <tr key={part.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4 font-medium">{part.code}</td>
                    <td className="px-6 py-4">{part.name}</td>
                    <td className="px-6 py-4">{Number(part.quantity)}</td>
                    <td className="px-6 py-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                part.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {part.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
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
