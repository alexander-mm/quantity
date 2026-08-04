import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { PartMovementForm } from "./part-movement-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function PartMovementModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Registrar movimiento</DialogTitle>
                </DialogHeader>
                <PartMovementForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
