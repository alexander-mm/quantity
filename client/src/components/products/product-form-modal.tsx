import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "./product-form";

type ProductFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    productId?: string;
};

export function ProductFormModal({
    open,
    onOpenChange,
    mode = "create",
    productId
}: ProductFormModalProps) {

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {
                            mode === "create"
                                ? "Nuevo producto"
                                : "Editar producto"
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {
                            mode === "create"
                                ? "Registra un nuevo producto en el inventario."
                                : "Modifica la información del producto."
                        }
                    </DialogDescription>
                </DialogHeader>
                <ProductForm
                    mode={mode}
                    productId={productId}
                    onSuccess={() => onOpenChange(false)}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}