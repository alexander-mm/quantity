import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReturnForm } from "./return-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ReturnModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nueva devolución</DialogTitle>
                </DialogHeader>
                <ReturnForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
