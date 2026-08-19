import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartCategoryForm } from "./part-category-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function PartCategoryModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nueva categoría de piezas</DialogTitle>
                </DialogHeader>
                <PartCategoryForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
