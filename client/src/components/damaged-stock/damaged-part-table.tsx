import { EntityTable } from "@/components/ui";
import type { DamagedPart } from "@/types";

type Props = {
    parts: DamagedPart[];
};

export function DamagedPartTable({ parts }: Props) {
    return (
        <EntityTable headers={["Código", "Pieza", "Cantidad dañada"]}>
            {parts.map(item => (
                <tr key={item.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{item.part.code}</td>
                    <td className="px-6 py-4">{item.part.name}</td>
                    <td className="px-6 py-4 font-medium text-red-600">{Number(item.quantity)}</td>
                </tr>
            ))}
        </EntityTable>
    );
}
