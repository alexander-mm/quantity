import { EntityTable } from "@/components/ui";
import type { User } from "@/types";

type Props = {
    users: User[];
};

export function UsersTable({ users }: Props) {
    return (
        <EntityTable
            headers={["Usuario", "Nombre", "Rol", "Tienda", "Estado"]}
        >
            {users.map(user => (
                <tr key={user.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4">{user.role.name}</td>
                    <td className="px-6 py-4">{user.store.name}</td>
                    <td className="px-6 py-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                user.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {user.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
