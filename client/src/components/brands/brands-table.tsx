import { Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Brand } from "@/types";

type Props = {
    brands: Brand[];
    onDelete: (brand: Brand) => void;
};

export function BrandsTable({ brands, onDelete }: Props) {
    return (
        <EntityTable headers={["Nombre", "Descripción", "Estado", "Acciones"]}>
            {brands.map(brand => (
                <tr key={brand.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{brand.name}</td>
                    <td className="px-6 py-4">{brand.description ?? "-"}</td>
                    <td className="px-6 py-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                brand.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {brand.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td>
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
