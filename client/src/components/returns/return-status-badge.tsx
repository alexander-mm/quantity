import type { ReturnStatus } from "@/types";

const STYLES: Record<ReturnStatus, string> = {
    PENDING_REVIEW: "bg-amber-100 text-amber-700",
    RESOLVED: "bg-green-100 text-green-700"
};

const LABELS: Record<ReturnStatus, string> = {
    PENDING_REVIEW: "Pendiente de revisión",
    RESOLVED: "Resuelta"
};

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${STYLES[status]}`}>
            {LABELS[status]}
        </span>
    );
}
