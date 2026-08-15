import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartAdjustmentForm } from "./part-adjustment-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function PartAdjustmentModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nuevo ajuste de pieza</DialogTitle>
                </DialogHeader>
                <PartAdjustmentForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
