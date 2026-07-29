import { EntityTable } from "@/components/ui";
import type { Category } from "@/types";

type Props = {
    categories: Category[];
};

export function CategoriesTable({ categories }: Props) {
    return (
        <EntityTable headers={[
            "Nombre", 
            // "Descripción",
            "Estado"
        ]}>
            {categories.map(category => (
                <tr key={category.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{category.name}</td>
                    {/* <td className="px-6 py-4">{category.description ?? "-"}</td> */}
                    <td className="px-6 py-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                category.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {category.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
