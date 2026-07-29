import { Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { User } from "@/types";

type Props = {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
};

export function UsersTable({ users, onEdit, onDelete }: Props) {
    return (
        <EntityTable
            headers={["Usuario", "Nombre", "Rol", "Tienda", "Acciones"]}
        >
            {users.map(user => (
                <tr key={user.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4">{user.role.name}</td>
                    <td className="px-6 py-4">{user.store.name}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Pencil
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onEdit(user)}
                            />
                            <Trash2
                                size={18}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => onDelete(user)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
