import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { AccountReceivable } from "@/types";
import { AccountReceivableView } from "./account-receivable-view";

type Props = {
    open: boolean;
    accountReceivable: AccountReceivable | null;
    onOpenChange: (open: boolean) => void;
};

export function AccountReceivableViewModal({ open, accountReceivable, onOpenChange }: Props) {

    if (!accountReceivable) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalle de cuenta de cobro</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Cuenta de cobro #{accountReceivable.number}
                    </p>
                </DialogHeader>
                <AccountReceivableView
                    accountReceivable={accountReceivable}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
