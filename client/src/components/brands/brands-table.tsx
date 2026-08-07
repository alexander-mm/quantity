import { Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Brand } from "@/types";

type Props = {
    brands: Brand[];
    onDelete: (brand: Brand) => void;
};

export function BrandsTable({ brands, onDelete }: Props) {
    return (
        <EntityTable headers={["Nombre", "Acciones"]}>
            {brands.map(brand => (
                <tr key={brand.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{brand.name}</td>
                    <td className="px-6 py-4">
                        <Trash2
                            size={18}
                            className="cursor-pointer text-red-500 hover:text-red-700"
                            onClick={() => onDelete(brand)}
                        />
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
