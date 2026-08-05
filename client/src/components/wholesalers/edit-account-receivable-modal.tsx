import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import type { AccountReceivable } from "@/types";
import { EditAccountReceivableForm } from "./edit-account-receivable-form";

type Props = {
    open: boolean;
    accountReceivable: AccountReceivable | null;
    onOpenChange: (open: boolean) => void;
};

export function EditAccountReceivableModal({ open, accountReceivable, onOpenChange }: Props) {

    if (!accountReceivable) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar cuenta de cobro</DialogTitle>
                </DialogHeader>
                <EditAccountReceivableForm
                    accountReceivable={accountReceivable}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
