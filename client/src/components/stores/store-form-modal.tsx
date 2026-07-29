import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StoreForm } from "./store-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    storeId?: string;
};

export function StoreFormModal({ open, onOpenChange, mode = "create", storeId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Nueva tienda" : "Editar tienda"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Registra una nueva tienda o bodega."
                            : "Modifica la información de la tienda."}
                    </DialogDescription>
                </DialogHeader>
                <StoreForm
                    mode={mode}
                    storeId={storeId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
