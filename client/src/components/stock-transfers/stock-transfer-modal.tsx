import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StockTransferForm } from "./stock-transfer-form";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; };

export function StockTransferModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Nuevo envío a tienda</DialogTitle>
                </DialogHeader>
                <StockTransferForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
