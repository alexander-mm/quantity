import {

    Dialog,

    DialogContent,

    DialogDescription,

    DialogHeader,

    DialogTitle

} from "@/components/ui/dialog";

import { ProductForm } from "./product-form";

type ProductFormModalProps = {

    open: boolean;

    onOpenChange: (open: boolean) => void;

};

export function ProductFormModal({

    open,

    onOpenChange

}: ProductFormModalProps) {

    return (

        <Dialog

            open={open}

            onOpenChange={onOpenChange}

        >

            <DialogContent className="sm:max-w-2xl">

                <DialogHeader>

                    <DialogTitle>

                        Nuevo producto

                    </DialogTitle>

                    <DialogDescription>

                        Registra un nuevo producto en el inventario.

                    </DialogDescription>

                </DialogHeader>

                <ProductForm />

            </DialogContent>

        </Dialog>

    );

}