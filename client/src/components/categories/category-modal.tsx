import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "./category-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    categoryId?: string;
};

export function CategoryModal({ open, onOpenChange, mode = "create", categoryId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
                </DialogHeader>
                <CategoryForm
                    mode={mode}
                    categoryId={categoryId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
