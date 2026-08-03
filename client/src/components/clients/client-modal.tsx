import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "./client-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    clientId?: string;
};

export function ClientModal({ open, onOpenChange, mode = "create", clientId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Nuevo cliente" : "Editar cliente"}
                    </DialogTitle>
                </DialogHeader>
                <ClientForm
                    mode={mode}
                    clientId={clientId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
