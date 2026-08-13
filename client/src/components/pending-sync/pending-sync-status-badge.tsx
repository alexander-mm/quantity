import type { OutboxStatus } from "@/lib/dexie";

const STYLES: Partial<Record<OutboxStatus, string>> = {
    pending: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700"
};

const LABELS: Partial<Record<OutboxStatus, string>> = {
    pending: "Pendiente de sincronizar",
    error: "Error al sincronizar"
};

export function PendingSyncStatusBadge({ status }: { status: OutboxStatus }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${STYLES[status] ?? "bg-muted text-muted-foreground"}`}>
            {LABELS[status] ?? status}
        </span>
    );
}
