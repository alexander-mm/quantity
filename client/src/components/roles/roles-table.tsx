import { Pencil, Ban } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Role } from "@/types";

type Props = {
    roles: Role[];
    onEdit: (role: Role) => void;
    onDeactivate: (role: Role) => void;
};

export function RolesTable({ roles, onEdit, onDeactivate }: Props) {
    return (
        <EntityTable headers={["Nombre", "Descripción", "Acciones"]}>
            {roles.map(role => (
                <tr key={role.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4 font-medium">{role.name}</td>
                    <td className="px-6 py-4">{role.description ?? "-"}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Pencil
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onEdit(role)}
                            />
                            <Ban
                                size={18}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => onDeactivate(role)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}