import { Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { MarginProfile } from "@/types";

type Props = {
    profiles: MarginProfile[];
    onEdit: (profile: MarginProfile) => void;
    onDelete: (profile: MarginProfile) => void;
};

export function MarginProfilesTable({ profiles, onEdit, onDelete }: Props) {

    return (
        <EntityTable headers={["Nombre", "Porcentaje", "Acciones"]}>
            {profiles.map(profile => (
                <tr key={profile.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{profile.name}</td>
                    <td className="px-6 py-4">{Number(profile.percentage)}%</td>
                    {/* <td className="px-6 py-4">{profile.displayOrder}</td>
                    <td className="px-6 py-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                profile.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {profile.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td> */}
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Pencil
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onEdit(profile)}
                            />
                            <Trash2
                                size={18}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => onDelete(profile)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}