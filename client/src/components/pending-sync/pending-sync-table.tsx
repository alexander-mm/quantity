import { useState } from "react";
import { RotateCw, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { EntityTable } from "@/components/ui";
import { offlineDb, type OutboxItem } from "@/lib/dexie";
import { retryOutboxItem, discardOutboxItem, processOutbox } from "@/lib/outbox";
import { useLiveQuery } from "@/hooks/sync";
import { formatCurrency } from "@/lib/format-currency";
import { PendingSyncStatusBadge } from "./pending-sync-status-badge";
import { DiscardOutboxItemDialog } from "./discard-outbox-item-dialog";

type SalePayload = {
    number: string;
    clientId: string;
    storeId: string;
    currency: "USD" | "COP";
    details: { quantity: number; unitPrice: number; discount?: number; tax?: number }[];
};

function OutboxRowSummary({ item }: { item: OutboxItem }) {

    const payload = item.entity === "sale" ? (item.payload as SalePayload) : null;

    const client = useLiveQuery(
        () => payload ? offlineDb.clients.get(payload.clientId) : Promise.resolve(undefined),
        [payload?.clientId],
        undefined
    );

    const store = useLiveQuery(
        () => payload ? offlineDb.stores.get(payload.storeId) : Promise.resolve(undefined),
        [payload?.storeId],
        undefined
    );

    if (!payload) {
        return <p className="font-medium">{item.entity}</p>;
    }

    const total = payload.details.reduce(
        (sum, detail) => sum + (detail.quantity * detail.unitPrice) - (detail.discount ?? 0) + (detail.tax ?? 0),
        0
    );

    const clientLabel = client
        ? (client.companyName || [client.firstName, client.lastName].filter(Boolean).join(" ") || client.document)
        : payload.clientId;

    return (
        <div>
            <p className="font-medium">Venta {payload.number}</p>
            <p className="text-sm text-muted-foreground">
                {clientLabel} · {store?.name ?? payload.storeId} · {payload.details.length} producto(s) · {formatCurrency(total, payload.currency)}
            </p>
        </div>
    );

}

function outboxItemSummaryText(item: OutboxItem): string {
    if (item.entity === "sale") {
        const payload = item.payload as SalePayload;
        return `la venta ${payload.number}`;
    }
    return "este registro";
}

type RowProps = {
    item: OutboxItem;
};

function PendingSyncRow({ item }: RowProps) {

    const [retrying, setRetrying] = useState(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);

    const handleRetry = async () => {
        setRetrying(true);
        try {
            await retryOutboxItem(item.id);
            await processOutbox();
            toast.success("Reintento enviado.");
        } catch {
            toast.error("No se pudo reintentar.");
        } finally {
            setRetrying(false);
        }
    };

    const handleDiscard = async () => {
        await discardOutboxItem(item.id);
        toast.success("Registro descartado.");
        setShowDiscardDialog(false);
    };

    return (
        <tr className="border-b transition hover:bg-muted/40">
            <td className="px-6 py-4">
                <OutboxRowSummary item={item} />
            </td>
            <td className="px-6 py-4">
                <PendingSyncStatusBadge status={item.status} />
                {item.status === "error" && item.lastError && (
                    <p className="mt-1 text-xs text-red-600">{item.lastError}</p>
                )}
            </td>
            <td className="px-6 py-4 text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    {item.status === "error" && (
                        <button
                            type="button"
                            className="flex items-center gap-1 text-sm text-primary hover:underline disabled:opacity-50"
                            disabled={retrying}
                            onClick={handleRetry}
                        >
                            <RotateCw size={16} />
                            Reintentar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowDiscardDialog(true)}
                    >
                        <Trash2 size={18} className="cursor-pointer text-slate-500 hover:text-red-600" />
                    </button>
                </div>

                <DiscardOutboxItemDialog
                    open={showDiscardDialog}
                    summary={outboxItemSummaryText(item)}
                    onConfirm={handleDiscard}
                    onCancel={() => setShowDiscardDialog(false)}
                />
            </td>
        </tr>
    );

}

type Props = {
    items: OutboxItem[];
};

export function PendingSyncTable({ items }: Props) {
    return (
        <EntityTable headers={["Registro", "Estado", "Creado", "Acciones"]}>
            {items.map(item => (
                <PendingSyncRow key={item.id} item={item} />
            ))}
        </EntityTable>
    );
}
