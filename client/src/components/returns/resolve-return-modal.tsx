import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useResolveReturn } from "@/hooks";
import { RETURN_REASON_LABELS } from "./return-reason-labels";
import { ReturnStatusBadge } from "./return-status-badge";
import type { Return } from "@/types";

type Props = {
    open: boolean;
    item: Return | null;
    onOpenChange: (open: boolean) => void;
};

export function ResolveReturnModal({ open, item, onOpenChange }: Props) {

    const resolveMutation = useResolveReturn();

    if (!item) {
        return null;
    }

    const handleResolve = (disposition: "RESTOCK" | "DAMAGED") => {
        resolveMutation.mutate({ id: item.id, disposition }, {
            onSuccess: () => {
                toast.success("Devolución resuelta.");
                onOpenChange(false);
            },
            onError: () => toast.error("No se pudo resolver la devolución.")
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Devolución {item.number}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="flex items-center justify-between text-sm">
                        <p><strong>Producto:</strong> {item.product.internalCode} - {item.product.name}</p>
                        <ReturnStatusBadge status={item.status} />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p><strong>Cantidad:</strong> {Number(item.quantity)}</p>
                        <p><strong>Motivo:</strong> {RETURN_REASON_LABELS[item.reason]}</p>
                        {item.sale && <p><strong>Venta:</strong> {item.sale.number}</p>}
                        {item.notes && <p><strong>Notas:</strong> {item.notes}</p>}
                        {item.disposition && (
                            <p><strong>Destino:</strong> {item.disposition === "RESTOCK" ? "Vuelve a stock vendible" : "Dañado"}</p>
                        )}
                    </div>

                    {item.status === "PENDING_REVIEW" ? (
                        <>
                            <p className="text-sm text-muted-foreground">
                                Después de revisar el producto, ¿cuál es su destino?
                            </p>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={resolveMutation.isPending}
                                    onClick={() => handleResolve("DAMAGED")}
                                >
                                    Marcar como dañado
                                </Button>
                                <Button
                                    type="button"
                                    disabled={resolveMutation.isPending}
                                    onClick={() => handleResolve("RESTOCK")}
                                >
                                    Vuelve a stock vendible
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-end">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cerrar
                            </Button>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}
