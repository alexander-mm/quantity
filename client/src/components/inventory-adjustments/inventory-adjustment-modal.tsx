import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InventoryAdjustmentForm } from "./inventory-adjustment-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function InventoryAdjustmentModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nuevo ajuste de inventario</DialogTitle>
                </DialogHeader>
                <InventoryAdjustmentForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}