import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { PartMovement } from "@/types";
import { PartMovementView } from "./part-movement-view";

type Props = {
    open: boolean;
    movement: PartMovement | null;
    onOpenChange: (open: boolean) => void;
};

export function PartMovementViewModal({ open, movement, onOpenChange }: Props) {

    if (!movement) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalle de movimiento</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Movimiento #{movement.number}
                    </p>
                </DialogHeader>
                <PartMovementView
                    movement={movement}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
