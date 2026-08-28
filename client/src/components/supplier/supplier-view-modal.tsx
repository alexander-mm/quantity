import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { Supplier } from "@/types";
import { SupplierView } from "./supplier-view";

type Props = {
    open: boolean;
    supplier: Supplier | null;
    onOpenChange: (open: boolean) => void;
};

export function SupplierViewModal({ open, supplier, onOpenChange }: Props) {

    if (!supplier) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalle de proveedor</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {supplier.code} - {supplier.companyName}
                    </p>
                </DialogHeader>
                <SupplierView
                    supplier={supplier}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
