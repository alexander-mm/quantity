import { useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {

    open: boolean;

    loading?: boolean;

    onConfirm: (reason: string) => void;

    onOpenChange: (open: boolean) => void;

};

const MIN_REASON_LENGTH = 5;

export function VoidSaleDialog({

    open,

    loading = false,

    onConfirm,

    onOpenChange

}: Props) {

    const [reason, setReason] = useState("");

    const isReasonValid = reason.trim().length >= MIN_REASON_LENGTH;

    return (

        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    setReason("");
                }
                onOpenChange(next);
            }}
        >

            <AlertDialogContent>

                <AlertDialogHeader>

                    <AlertDialogTitle>
                        Anular venta
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Los productos de esta venta volverán al inventario de la tienda donde se vendieron.
                        Esta acción no puede deshacerse.
                    </AlertDialogDescription>

                </AlertDialogHeader>

                <div className="space-y-2">

                    <Label htmlFor="void-sale-reason">
                        Motivo de la anulación
                    </Label>

                    <Input
                        id="void-sale-reason"
                        autoFocus
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Ej: el cliente devolvió todo el pedido"
                    />

                </div>

                <AlertDialogFooter>

                    <AlertDialogCancel>
                        No
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading || !isReasonValid}
                        onClick={() => onConfirm(reason.trim())}
                    >

                        {
                            loading
                                ? "Anulando..."
                                : "Sí, anular"
                        }

                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>

    );

}
