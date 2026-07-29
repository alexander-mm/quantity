import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UnitOfMeasureForm } from "./unit-of-measure-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function UnitOfMeasureModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nueva unidad de medida</DialogTitle>
                </DialogHeader>
                <UnitOfMeasureForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
