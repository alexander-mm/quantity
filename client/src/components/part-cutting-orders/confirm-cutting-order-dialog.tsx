import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmPartCuttingOrderSchema } from "@/validators";
import type { ConfirmPartCuttingOrderFormData } from "@/validators";
import type { PartCuttingOrder } from "@/types";

type Props = {
    open: boolean;
    order: PartCuttingOrder | null;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: { goodPieces: number; defectivePieces?: number }) => void;
};

export function ConfirmCuttingOrderDialog({ open, order, loading = false, onOpenChange, onConfirm }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ConfirmPartCuttingOrderFormData>({
        resolver: zodResolver(confirmPartCuttingOrderSchema),
        defaultValues: {
            goodPieces: undefined,
            defectivePieces: undefined
        }
    });

    useEffect(() => {

        if (order) {
            reset({
                goodPieces: Number(order.expectedPieces),
                defectivePieces: undefined
            });
        }

    }, [order, reset]);

    if (!order) {
        return null;
    }

    const onSubmit = (data: ConfirmPartCuttingOrderFormData) => {
        onConfirm({
            goodPieces: Number(data.goodPieces),
            defectivePieces: data.defectivePieces !== undefined ? Number(data.defectivePieces) : undefined
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Confirmar orden de corte</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate className="space-y-5">

                    <p className="text-sm text-muted-foreground">
                        Esto descontará <strong>{Number(order.rawMaterialQtyUsed)}</strong> unidad(es) de{" "}
                        <strong>{order.rawMaterial.name}</strong> y sumará las piezas buenas al inventario de{" "}
                        <strong>{order.part.name}</strong>. Estimado: {Number(order.expectedPieces)} piezas.
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div>
                            <Label>Piezas buenas</Label>
                            <Input type="number" min={0} step="1" placeholder="0" {...register("goodPieces", {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            })} />
                            <p className="text-sm text-red-500">{errors.goodPieces?.message}</p>
                        </div>

                        <div>
                            <Label>Piezas dañadas (novedad)</Label>
                            <Input type="number" min={0} step="1" placeholder="0" {...register("defectivePieces", {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            })} />
                            <p className="text-sm text-red-500">{errors.defectivePieces?.message}</p>
                        </div>

                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Confirmando..." : "Confirmar"}
                        </Button>
                    </div>

                </form>

            </DialogContent>
        </Dialog>
    );
}
