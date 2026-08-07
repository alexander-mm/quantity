import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { SupplierForm } from "./supplier-form";

type SupplierFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    supplierId?: string;
};

export function SupplierFormModal({

    open,
    onOpenChange,
    mode = "create",
    supplierId

}: SupplierFormModalProps) {

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
                                ? "Nuevo proveedor"
                                : "Editar proveedor"
                        }

                    </DialogTitle>

                    <DialogDescription>

                        {
                            mode === "create"
                                ? "Registra un nuevo proveedor."
                                : "Modifica la información del proveedor."
                        }

                    </DialogDescription>

                </DialogHeader>

                <SupplierForm

                    mode={mode}

                    supplierId={supplierId}

                    onSuccess={() => onOpenChange(false)}

                    onCancel={() => onOpenChange(false)}

                />

            </DialogContent>

        </Dialog>

    );

}