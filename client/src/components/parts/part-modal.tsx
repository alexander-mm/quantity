import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartForm } from "./part-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    partId?: string;
};

export function PartModal({ open, onOpenChange, mode = "create", partId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Nueva pieza" : "Editar pieza"}
                    </DialogTitle>
                </DialogHeader>
                <PartForm
                    mode={mode}
                    partId={partId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
