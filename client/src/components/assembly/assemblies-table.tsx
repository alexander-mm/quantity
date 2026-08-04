import { Check, Eye, Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { AssemblyStatusBadge } from "./assembly-status-badge";
import type { ProductAssembly } from "@/types";

type Props = {
    assemblies: ProductAssembly[];
    onView: (assembly: ProductAssembly) => void;
    onEdit: (assembly: ProductAssembly) => void;
    onConfirm: (assembly: ProductAssembly) => void;
    onDelete: (assembly: ProductAssembly) => void;
};

export function AssembliesTable({ assemblies, onView, onEdit, onConfirm, onDelete }: Props) {
    return (
        <EntityTable headers={["Número", "Producto", "Cantidad", "Estado", "Fecha", "Registrado por", "Acciones"]}>
            {assemblies.map(assembly => (
                <tr key={assembly.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{assembly.number}</td>
                    <td className="px-6 py-4">{assembly.product.internalCode} - {assembly.product.name}</td>
                    <td className="px-6 py-4">{Number(assembly.quantity)}</td>
                    <td className="px-6 py-4">
                        <AssemblyStatusBadge status={assembly.status} />
                    </td>
                    <td className="px-6 py-4">
                        {new Date(assembly.assemblyDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                        {assembly.user.firstName} {assembly.user.lastName}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Eye
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onView(assembly)}
                            />
                            {assembly.status === "DRAFT" && (
                                <>
                                    <Pencil
                                        size={18}
                                        className="cursor-pointer text-slate-500 hover:text-primary"
                                        onClick={() => onEdit(assembly)}
                                    />
                                    <Check
                                        size={18}
                                        className="cursor-pointer text-green-600 hover:text-green-700"
                                        onClick={() => onConfirm(assembly)}
                                    />
                                    <Trash2
                                        size={18}
                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                        onClick={() => onDelete(assembly)}
                                    />
                                </>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
