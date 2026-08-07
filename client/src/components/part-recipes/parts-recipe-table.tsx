import { Settings2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Part } from "@/types";

type Props = {
    parts: Part[];
    onEditRecipe: (part: Part) => void;
};

export function PartsRecipeTable({ parts, onEditRecipe }: Props) {
    return (
        <EntityTable headers={["Código", "Nombre", "Stock actual", "Acciones"]}>
            {parts.map(part => (
                <tr key={part.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4 font-medium">{part.code}</td>
                    <td className="px-6 py-4">{part.name}</td>
                    <td className="px-6 py-4">{Number(part.quantity)}</td>
                    <td className="px-6 py-4">
                        <button
                            type="button"
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                            onClick={() => onEditRecipe(part)}
                        >
                            <Settings2 size={16} />
                            Editar receta
                        </button>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
