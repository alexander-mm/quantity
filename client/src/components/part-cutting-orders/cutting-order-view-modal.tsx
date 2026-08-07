import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { PartCuttingOrder } from "@/types";
import { CuttingOrderView } from "./cutting-order-view";

type Props = {
    open: boolean;
    order: PartCuttingOrder | null;
    onOpenChange: (open: boolean) => void;
};

export function CuttingOrderViewModal({ open, order, onOpenChange }: Props) {

    if (!order) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalle de orden de corte</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Orden #{order.number}
                    </p>
                </DialogHeader>
                <CuttingOrderView
                    order={order}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
