import { Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { PartCategory } from "@/types";

type Props = {
    categories: PartCategory[];
    onDelete: (category: PartCategory) => void;
};

export function PartCategoriesTable({ categories, onDelete }: Props) {
    return (
        <EntityTable headers={["Nombre", "Acciones"]}>
            {categories.map(category => (
                <tr key={category.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{category.name}</td>
                    <td className="px-6 py-4">
                        <Trash2
                            size={18}
                            className="cursor-pointer text-red-500 hover:text-red-700"
                            onClick={() => onDelete(category)}
                        />
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
