import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Part } from "@/types";
import { PartRecipeForm } from "./part-recipe-form";

type Props = {
    open: boolean;
    part: Part | null;
    onOpenChange: (open: boolean) => void;
};

export function PartRecipeModal({ open, part, onOpenChange }: Props) {

    if (!part) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Receta de corte</DialogTitle>
                </DialogHeader>
                <PartRecipeForm
                    part={part}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
