import { useState } from "react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResolveStockTransfer } from "@/hooks";
import type { StockTransfer } from "@/types";

type Props = {
    open: boolean;
    transfer: StockTransfer | null;
    onOpenChange: (open: boolean) => void;
};

export function ResolveTransferModal({ open, transfer, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {transfer && (
                <ResolveTransferModalContent
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

function ResolveTransferModalContent({ transfer, onDone }: ContentProps) {

    const [quantities, setQuantities] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        transfer.details.forEach(d => {
            initial[d.product.id] = Number(d.quantityReceived ?? d.quantitySent);
        });
        return initial;
    });

    const resolveMutation = useResolveStockTransfer();

    const destLabel = transfer.destType === "TECHNICIAN"
        ? `${transfer.destUser?.firstName} ${transfer.destUser?.lastName} (Técnico)`
        : transfer.destStore?.name;

    const handleResolve = () => {
        resolveMutation.mutate({
            id: transfer.id,
            data: {
                details: transfer.details.map(d => ({
                    productId: d.product.id,
                    quantityReceived: quantities[d.product.id] ?? 0
                }))
            }
        }, {
            onSuccess: () => {
                toast.success("Novedad resuelta correctamente.");
                onDone();
            },
            onError: () => toast.error("No se pudo resolver la novedad.")
        });
    };

    return (
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Resolver novedad — envío {transfer.number}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

                <p className="text-sm text-muted-foreground">
                    Destino: <strong>{destLabel}</strong>
                </p>

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
                                <th className="p-3 text-left">Cantidad final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfer.details.map(detail => (
                                <tr key={detail.id} className="border-b">
                                    <td className="p-3">{detail.product.name}</td>
                                    <td className="p-3">{detail.quantitySent}</td>
                                    <td className="p-3">{detail.quantityReceived ?? "-"}</td>
                                    <td className="p-3 w-32">
                                        <Input
                                            type="number"
                                            min={0}
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

                <p className="text-xs text-muted-foreground">
                    La "cantidad final" es lo que efectivamente se confirma como recibido, luego de confirmar con la tienda
                    o bodega correspondiente. El origen se ajusta automáticamente por la diferencia: si es mayor a lo
                    enviado, se descarga la diferencia adicional del origen; si es menor, la diferencia se devuelve al origen.
                </p>

                <div className="flex justify-end">
                    <Button onClick={handleResolve} disabled={resolveMutation.isPending}>
                        {resolveMutation.isPending ? "Resolviendo..." : "Resolver novedad"}
                    </Button>
                </div>

            </div>
        </DialogContent>
    );
}
