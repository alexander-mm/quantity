import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { CuttingOrderForm } from "./cutting-order-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    orderId?: string;
};

export function CuttingOrderModal({ open, onOpenChange, mode = "create", orderId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Nueva orden de corte" : "Editar orden de corte"}
                    </DialogTitle>
                </DialogHeader>
                <CuttingOrderForm
                    mode={mode}
                    orderId={orderId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
