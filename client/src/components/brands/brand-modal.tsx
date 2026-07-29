import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BrandForm } from "./brand-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function BrandModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nueva marca</DialogTitle>
                </DialogHeader>
                <BrandForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
