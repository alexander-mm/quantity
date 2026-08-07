import { Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Category } from "@/types";

type Props = {
    categories: Category[];
    onDelete: (category: Category) => void;
};

export function CategoriesTable({ categories, onDelete }: Props) {
    return (
        <EntityTable headers={[
            "Nombre",
            "Acciones"
        ]}>
            {categories.map(category => (
                <tr key={category.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{category.name}</td>
                    {/* <td className="px-6 py-4">{category.description ?? "-"}</td> */}
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
