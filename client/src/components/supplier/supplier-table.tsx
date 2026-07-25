import { Eye, Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Supplier } from "@/types";

type Props = {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onDelete: (supplier: Supplier) => void;
};

export function SuppliersTable({

    suppliers,
    onEdit,
    onDelete

}: Props) {

    return (

        <EntityTable

            headers={[

                "Código",

                "Razón social",

                "Contacto",

                "Ciudad",

                "Teléfono",

                "Estado",

                "Acciones"

            ]}

        >

            {

                suppliers.map(supplier => (

                    <tr

                        key={supplier.id}

                        className="border-b transition hover:bg-muted/40"

                    >

                        <td className="px-6 py-4">

                            {supplier.code}

                        </td>

                        <td className="px-6 py-4 font-medium">

                            {supplier.companyName}

                        </td>

                        <td className="px-6 py-4">

                            {supplier.contactName ?? "-"}

                        </td>

                        <td className="px-6 py-4">

                            {supplier.city ?? "-"}

                        </td>

                        <td className="px-6 py-4">

                            {supplier.phone ?? "-"}

                        </td>

                        <td className="px-6 py-4">

                            <span

                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    supplier.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}

                            >

                                {supplier.isActive
                                    ? "Activo"
                                    : "Inactivo"}

                            </span>

                        </td>

                        <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                                <Eye

                                    size={18}

                                    className="cursor-pointer text-slate-500 hover:text-primary"

                                />

                                <Pencil

                                    size={18}

                                    className="cursor-pointer text-slate-500 hover:text-primary"

                                    onClick={() => onEdit(supplier)}

                                />

                                <Trash2

                                    size={18}

                                    className="cursor-pointer text-red-500 hover:text-red-700"

                                    onClick={() => onDelete(supplier)}

                                />

                            </div>

                        </td>

                    </tr>

                ))

            }

        </EntityTable>

    );

}