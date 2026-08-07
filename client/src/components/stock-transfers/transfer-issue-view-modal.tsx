import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StockTransferStatusBadge } from "./stock-transfer-status-badge";
import type { StockTransfer } from "@/types";

type Props = {
    open: boolean;
    transfer: StockTransfer | null;
    onOpenChange: (open: boolean) => void;
};

export function TransferIssueViewModal({ open, transfer, onOpenChange }: Props) {

    if (!transfer) {
        return null;
    }

    const destLabel = transfer.destType === "TECHNICIAN"
        ? `${transfer.destUser?.firstName} ${transfer.destUser?.lastName} (Técnico)`
        : transfer.destStore?.name;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Novedad — envío {transfer.number}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Origen: <strong>{transfer.originStore.name}</strong> → Destino: <strong>{destLabel}</strong>
                        </p>
                        <StockTransferStatusBadge status={transfer.status} />
                    </div>

                    {transfer.observations && (
                        <p className="text-sm text-muted-foreground">
                            <strong>Novedad reportada:</strong> {transfer.observations}
                        </p>
                    )}

                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full">
                            <thead className="bg-muted/40">
                                <tr>
                                    <th className="p-3 text-left">Producto</th>
                                    <th className="p-3 text-left">Enviado</th>
                                    <th className="p-3 text-left">Reportado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfer.details.map(detail => (
                                    <tr key={detail.id} className="border-b">
                                        <td className="p-3">{detail.product.name}</td>
                                        <td className="p-3">{detail.quantitySent}</td>
                                        <td className="p-3">{detail.quantityReceived ?? "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {transfer.status === "WITH_ISSUES"
                            ? "Esta novedad está pendiente de resolución por un administrador."
                            : "Esta novedad ya fue resuelta."}
                    </p>

                    <div className="flex justify-end">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cerrar
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
