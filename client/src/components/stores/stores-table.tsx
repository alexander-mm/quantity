import { Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import type { Store } from "@/types";

type Props = {
    stores: Store[];
    onEdit: (store: Store) => void;
    onDelete: (store: Store) => void;
};

export function StoresTable({ stores, onEdit, onDelete }: Props) {
    return (
        <EntityTable headers={["Código", "Nombre", "Tipo", "Ciudad", "Estado", "Acciones"]}>
            {stores.map(store => (
                <tr key={store.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{store.code}</td>
                    <td className="px-6 py-4 font-medium">{store.name}</td>
                    <td className="px-6 py-4">
                        {store.type === "MAIN_WAREHOUSE" ? "Bodega Principal" : "Tienda"}
                    </td>
                    <td className="px-6 py-4">{store.city ?? "-"}</td>
                    <td className="px-6 py-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                store.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {store.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Pencil
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onEdit(store)}
                            />
                            <Trash2
                                size={18}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => onDelete(store)}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
