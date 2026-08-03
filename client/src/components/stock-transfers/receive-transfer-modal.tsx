import { useState } from "react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirmStockTransfer, useReportStockTransferIssue } from "@/hooks";
import type { StockTransfer } from "@/types";

type Props = {
    open: boolean;
    transfer: StockTransfer | null;
    onOpenChange: (open: boolean) => void;
};

export function ReceiveTransferModal({ open, transfer, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {transfer && (
                <ReceiveTransferModalContent
                    key={transfer.id}
                    transfer={transfer}
                    onDone={() => onOpenChange(false)}
                />
            )}
        </Dialog>
    );
}

type ContentProps = {
    transfer: StockTransfer;
    onDone: () => void;
};

function ReceiveTransferModalContent({ transfer, onDone }: ContentProps) {

    const [quantities, setQuantities] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        transfer.details.forEach(d => {
            initial[d.product.id] = Number(d.quantitySent);
        });
        return initial;
    });

    const [observations, setObservations] = useState("");

    const confirmMutation = useConfirmStockTransfer();
    const reportIssueMutation = useReportStockTransferIssue();

    const readOnly = transfer.status !== "PENDING";

    const hasDiscrepancy = transfer.details.some(
        d => quantities[d.product.id] !== Number(d.quantitySent)
    );

    const handleConfirm = () => {
        confirmMutation.mutate(transfer.id, {
            onSuccess: () => {
                toast.success("Recepción confirmada.");
                onDone();
            },
            onError: () => toast.error("No se pudo confirmar la recepción.")
        });
    };

    const handleReportIssue = () => {

        if (!observations.trim()) {
            toast.error("Describe la novedad antes de enviarla.");
            return;
        }

        reportIssueMutation.mutate({
            id: transfer.id,
            data: {
                observations,
                details: transfer.details.map(d => ({
                    productId: d.product.id,
                    quantityReceived: quantities[d.product.id] ?? 0
                }))
            }
        }, {
            onSuccess: () => {
                toast.success("Novedad registrada. Un administrador la revisará.");
                onDone();
            },
            onError: () => toast.error("No se pudo registrar la novedad.")
        });

    };

    return (
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Recepción de envío {transfer.number}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="p-3 text-left">Producto</th>
                                <th className="p-3 text-left">Enviado</th>
                                <th className="p-3 text-left">Recibido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfer.details.map(detail => (
                                <tr key={detail.id} className="border-b">
                                    <td className="p-3">{detail.product.name}</td>
                                    <td className="p-3">{detail.quantitySent}</td>
                                    <td className="p-3 w-32">
                                        <Input
                                            type="number"
                                            min={0}
                                            disabled={readOnly}
                                            value={quantities[detail.product.id] ?? 0}
                                            onChange={(e) => setQuantities(prev => ({
                                                ...prev,
                                                [detail.product.id]: Number(e.target.value)
                                            }))}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {readOnly ? (
                    transfer.observations && (
                        <p className="text-sm text-muted-foreground">
                            <strong>Novedad reportada:</strong> {transfer.observations}
                        </p>
                    )
                ) : (
                    <>
                        {hasDiscrepancy && (
                            <div>
                                <Label>Describe la novedad</Label>
                                <Input value={observations} onChange={(e) => setObservations(e.target.value)} />
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            {hasDiscrepancy ? (
                                <Button
                                    variant="destructive"
                                    onClick={handleReportIssue}
                                    disabled={reportIssueMutation.isPending}
                                >
                                    Reportar novedad
                                </Button>
                            ) : (
                                <Button onClick={handleConfirm} disabled={confirmMutation.isPending}>
                                    Confirmar recepción
                                </Button>
                            )}
                        </div>
                    </>
                )}

            </div>
        </DialogContent>
    );
}
