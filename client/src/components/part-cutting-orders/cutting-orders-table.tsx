import { Check, Eye, Pencil, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { CuttingOrderStatusBadge } from "./cutting-order-status-badge";
import type { PartCuttingOrder } from "@/types";

type Props = {
    orders: PartCuttingOrder[];
    onView: (order: PartCuttingOrder) => void;
    onEdit: (order: PartCuttingOrder) => void;
    onConfirm: (order: PartCuttingOrder) => void;
    onDelete: (order: PartCuttingOrder) => void;
};

export function CuttingOrdersTable({ orders, onView, onEdit, onConfirm, onDelete }: Props) {
    return (
        <EntityTable headers={["Número", "Pieza", "Materia prima", "Estado", "Fecha", "Registrado por", "Acciones"]}>
            {orders.map(order => (
                <tr key={order.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{order.number}</td>
                    <td className="px-6 py-4">{order.part.code} - {order.part.name}</td>
                    <td className="px-6 py-4">{order.rawMaterial.code} - {order.rawMaterial.name}</td>
                    <td className="px-6 py-4">
                        <CuttingOrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                        {new Date(order.cuttingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                        {order.user.firstName} {order.user.lastName}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Eye
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onView(order)}
                            />
                            {order.status === "DRAFT" && (
                                <>
                                    <Pencil
                                        size={18}
                                        className="cursor-pointer text-slate-500 hover:text-primary"
                                        onClick={() => onEdit(order)}
                                    />
                                    <Check
                                        size={18}
                                        className="cursor-pointer text-green-600 hover:text-green-700"
                                        onClick={() => onConfirm(order)}
                                    />
                                    <Trash2
                                        size={18}
                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                        onClick={() => onDelete(order)}
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
