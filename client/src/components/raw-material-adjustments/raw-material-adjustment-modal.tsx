import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RawMaterialAdjustmentForm } from "./raw-material-adjustment-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RawMaterialAdjustmentModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nuevo ajuste de materia prima</DialogTitle>
                </DialogHeader>
                <RawMaterialAdjustmentForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
