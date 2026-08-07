import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { RawMaterialMovement } from "@/types";
import { RawMaterialMovementView } from "./raw-material-movement-view";

type Props = {
    open: boolean;
    movement: RawMaterialMovement | null;
    onOpenChange: (open: boolean) => void;
};

export function RawMaterialMovementViewModal({ open, movement, onOpenChange }: Props) {

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
                <RawMaterialMovementView
                    movement={movement}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
