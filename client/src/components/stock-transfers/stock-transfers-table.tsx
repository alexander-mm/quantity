import { Eye } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { StockTransferStatusBadge } from "./stock-transfer-status-badge";
import type { StockTransfer } from "@/types";

type Props = { transfers: StockTransfer[]; onView: (transfer: StockTransfer) => void; };

export function StockTransfersTable({ transfers, onView }: Props) {
    return (
        <EntityTable headers={["Número", "Fecha", "Origen", "Destino", "Estado", "Acciones"]}>
            {transfers.map(transfer => (
                <tr key={transfer.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{transfer.number}</td>
                    <td className="px-6 py-4">{new Date(transfer.dispatchDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{transfer.originStore.name}</td>
                    <td className="px-6 py-4">
                        {transfer.destType === "TECHNICIAN"
                            ? `${transfer.destUser?.firstName} ${transfer.destUser?.lastName} (Técnico)`
                            : transfer.destStore?.name}
                    </td>
                    <td className="px-6 py-4"><StockTransferStatusBadge status={transfer.status} /></td>
                    <td className="px-6 py-4">
                        <Eye size={18} className="cursor-pointer text-slate-500 hover:text-primary" onClick={() => onView(transfer)} />
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
