import { Eye, Pencil, Send, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { StockTransferStatusBadge } from "./stock-transfer-status-badge";
import { formatDateOnly } from "@/lib/format-date";
import type { StockTransfer } from "@/types";

type Props = {
    transfers: StockTransfer[];
    onView: (transfer: StockTransfer) => void;
    onEdit?: (transfer: StockTransfer) => void;
    onDispatch?: (transfer: StockTransfer) => void;
    onDelete?: (transfer: StockTransfer) => void;
};

export function StockTransfersTable({ transfers, onView, onEdit, onDispatch, onDelete }: Props) {
    return (
        <EntityTable headers={["Número", "Fecha", "Origen", "Destino", "Estado", "Acciones"]}>
            {transfers.map(transfer => (
                <tr key={transfer.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{transfer.number}</td>
                    <td className="px-6 py-4">{formatDateOnly(transfer.dispatchDate)}</td>
                    <td className="px-6 py-4">{transfer.originStore.name}</td>
                    <td className="px-6 py-4">
                        {transfer.destType === "TECHNICIAN"
                            ? `${transfer.destUser?.firstName} ${transfer.destUser?.lastName} (Técnico)`
                            : transfer.destStore?.name}
                    </td>
                    <td className="px-6 py-4"><StockTransferStatusBadge status={transfer.status} /></td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            {transfer.status === "DRAFT" && onEdit && (
                                <Pencil
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
                                    onClick={() => onEdit(transfer)}
                                />
                            )}
                            {transfer.status === "DRAFT" && onDispatch && (
                                <Send
                                    size={18}
                                    className="cursor-pointer text-green-600 hover:text-green-700"
                                    onClick={() => onDispatch(transfer)}
                                />
                            )}
                            {transfer.status !== "DRAFT" && (
                                <Eye
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
                                    onClick={() => onView(transfer)}
                                />
                            )}
                            {(transfer.status === "DRAFT" || transfer.status === "PENDING" || transfer.status === "WITH_ISSUES") && onDelete && (
                                <Trash2
                                    size={18}
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() => onDelete(transfer)}
                                />
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
