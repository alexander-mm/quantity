import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StockTransferForm } from "./stock-transfer-form";
import type { StockTransfer } from "@/types";

type Props = {
    open: boolean;
    transfer?: StockTransfer | null;
    onOpenChange: (open: boolean) => void;
};

export function StockTransferModal({ open, transfer, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{transfer ? `Editar envío ${transfer.number}` : "Nuevo envío a tienda"}</DialogTitle>
                </DialogHeader>
                <StockTransferForm
                    key={transfer?.id ?? "new"}
                    transfer={transfer}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
