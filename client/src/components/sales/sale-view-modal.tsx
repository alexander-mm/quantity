import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { Sale } from "@/types";
import { SaleView } from "./sale-view";

type Props = {

    open: boolean;

    sale: Sale | null;

    onOpenChange: (open: boolean) => void;

};

export function SaleViewModal({

    open,

    sale,

    onOpenChange

}: Props) {

    if (!sale) {

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
                        Detalle de venta
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Venta #{sale.number}
                    </p>
                </DialogHeader>
                <SaleView
                    sale={sale}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
