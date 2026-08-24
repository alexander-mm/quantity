import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { AccountReceivable } from "@/types";
import { MakeAccountReceivablePaymentForm } from "./make-account-receivable-payment-form";

type Props = {
    open: boolean;
    accountReceivable: AccountReceivable | null;
    onOpenChange: (open: boolean) => void;
};

export function MakeAccountReceivablePaymentModal({ open, accountReceivable, onOpenChange }: Props) {

    if (!accountReceivable) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Registrar abono — {accountReceivable.number}</DialogTitle>
                </DialogHeader>
                <MakeAccountReceivablePaymentForm
                    accountReceivable={accountReceivable}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
