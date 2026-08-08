import { Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Category } from "@/types";

type Props = {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
};

export function CategoriesTable({ categories, onEdit, onDelete }: Props) {
    return (
        <EntityTable headers={[
            "Nombre",
            "Multiplicador de stock medio",
            "Acciones"
        ]}>
            {categories.map(category => (
                <tr key={category.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{category.name}</td>
                    <td className="px-6 py-4">{Number(category.stockMultiplier)}x</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Pencil
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onEdit(category)}
                            />
                            <Trash2
                                size={18}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => onDelete(category)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
