import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { Purchase } from "@/types";
import { PurchaseView } from "./purchase-view";

type Props = {

    open: boolean;

    purchase: Purchase | null;

    onOpenChange: (open: boolean) => void;

};

export function PurchaseViewModal({

    open,

    purchase,

    onOpenChange

}: Props) {

    if (!purchase) {

        return null;

    }

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>
                        Detalle de compra
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Compra #{purchase.number}
                    </p>
                </DialogHeader>
                <PurchaseView
                    purchase={purchase}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}