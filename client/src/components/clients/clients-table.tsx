import { Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { useAuth } from "@/hooks";
import { ROLES } from "@/constants/roles";
import type { Client } from "@/types";

type Props = {
    clients: Client[];
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
};

function getClientLabel(client: Client) {
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || client.document);
}

export function ClientsTable({ clients, onEdit, onDelete }: Props) {
    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;

    return (
        <EntityTable headers={["Cliente", "Documento", "Teléfono", "Descuento", "Acciones"]}>
            {clients.map(client => (
                <tr key={client.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4 font-medium">{getClientLabel(client)}</td>
                    <td className="px-6 py-4">{client.document}</td>
                    <td className="px-6 py-4">{client.phone ?? "-"}</td>
                    <td className="px-6 py-4">
                        {client.discountPercentage
                            ? `${Number(client.discountPercentage)}%`
                            : "-"}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Pencil
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onEdit(client)}
                            />
                            {isAdmin && (
                                <Trash2
                                    size={18}
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() => onDelete(client)}
                                />
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
