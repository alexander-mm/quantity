import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { RawMaterialMovementForm } from "./raw-material-movement-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RawMaterialMovementModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Registrar movimiento</DialogTitle>
                </DialogHeader>
                <RawMaterialMovementForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
