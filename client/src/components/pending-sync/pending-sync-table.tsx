import { useState } from "react";
import { RotateCw, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { EntityTable } from "@/components/ui";
import { offlineDb, type OutboxItem } from "@/lib/dexie";
import { retryOutboxItem, discardOutboxItem, processOutbox } from "@/lib/outbox";
import { useLiveQuery } from "@/hooks/sync";
import { formatCurrency } from "@/lib/format-currency";
import { RETURN_REASON_LABELS } from "@/components/returns";
import type { ReturnReason } from "@/types";
import { PendingSyncStatusBadge } from "./pending-sync-status-badge";
import { DiscardOutboxItemDialog } from "./discard-outbox-item-dialog";

type SalePayload = {
    number: string;
    clientId: string;
    storeId: string;
    currency: "USD" | "COP";
    details: { quantity: number; unitPrice: number; discount?: number; tax?: number }[];
};

type ReturnPayload = {
    number: string;
    productId: string;
    storeId: string;
    quantity: number;
    reason: ReturnReason;
};

function OutboxRowSummary({ item }: { item: OutboxItem }) {

    const salePayload = item.entity === "sale" ? (item.payload as SalePayload) : null;
    const returnPayload = item.entity === "return" ? (item.payload as ReturnPayload) : null;

    const client = useLiveQuery(
        () => salePayload ? offlineDb.clients.get(salePayload.clientId) : Promise.resolve(undefined),
        [salePayload?.clientId],
        undefined
    );

    const product = useLiveQuery(
        () => returnPayload ? offlineDb.products.get(returnPayload.productId) : Promise.resolve(undefined),
        [returnPayload?.productId],
        undefined
    );

    const storeId = salePayload?.storeId ?? returnPayload?.storeId;

    const store = useLiveQuery(
        () => storeId ? offlineDb.stores.get(storeId) : Promise.resolve(undefined),
        [storeId],
        undefined
    );

    if (salePayload) {

        const total = salePayload.details.reduce(
            (sum, detail) => sum + (detail.quantity * detail.unitPrice) - (detail.discount ?? 0) + (detail.tax ?? 0),
            0
        );

        const clientLabel = client
            ? (client.companyName || [client.firstName, client.lastName].filter(Boolean).join(" ") || client.document)
            : salePayload.clientId;

        return (
            <div>
                <p className="font-medium">Venta {salePayload.number}</p>
                <p className="text-sm text-muted-foreground">
                    {clientLabel} · {store?.name ?? salePayload.storeId} · {salePayload.details.length} producto(s) · {formatCurrency(total, salePayload.currency)}
                </p>
            </div>
        );

    }

    if (returnPayload) {

        return (
            <div>
                <p className="font-medium">Devolución {returnPayload.number}</p>
                <p className="text-sm text-muted-foreground">
                    {product ? `${product.internalCode} - ${product.name}` : returnPayload.productId} · {returnPayload.quantity} unidad(es) · {RETURN_REASON_LABELS[returnPayload.reason]} · {store?.name ?? returnPayload.storeId}
                </p>
            </div>
        );

    }

    return <p className="font-medium">{item.entity}</p>;

}

function outboxItemSummaryText(item: OutboxItem): string {
    if (item.entity === "sale") {
        const payload = item.payload as SalePayload;
        return `la venta ${payload.number}`;
    }
    if (item.entity === "return") {
        const payload = item.payload as ReturnPayload;
        return `la devolución ${payload.number}`;
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
