import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { InventoryMovement } from "@/types";
import { InventoryMovementView } from "./inventory-movement-view";

type Props = {
    open: boolean;
    movement: InventoryMovement | null;
    onOpenChange: (open: boolean) => void;
};

export function InventoryMovementViewModal({ open, movement, onOpenChange }: Props) {

    if (!movement) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalle de movimiento</DialogTitle>
                </DialogHeader>
                <InventoryMovementView
                    movement={movement}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
