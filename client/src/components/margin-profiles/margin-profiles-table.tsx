import { EntityTable } from "@/components/ui";
import type { MarginProfile } from "@/types";

type Props = {
    profiles: MarginProfile[];
};

export function MarginProfilesTable({ profiles }: Props) {
    return (
        <EntityTable headers={["Nombre", "Porcentaje", "Orden", "Estado"]}>
            {profiles.map(profile => (
                <tr key={profile.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{profile.name}</td>
                    <td className="px-6 py-4">{Number(profile.percentage)}%</td>
                    <td className="px-6 py-4">{profile.displayOrder}</td>
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
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
