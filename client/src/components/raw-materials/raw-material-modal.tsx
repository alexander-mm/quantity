import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RawMaterialForm } from "./raw-material-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    rawMaterialId?: string;
};

export function RawMaterialModal({ open, onOpenChange, mode = "create", rawMaterialId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Nueva materia prima" : "Editar materia prima"}
                    </DialogTitle>
                </DialogHeader>
                <RawMaterialForm
                    mode={mode}
                    rawMaterialId={rawMaterialId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
