import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserForm } from "./user-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function UserModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nuevo usuario</DialogTitle>
                </DialogHeader>
                <UserForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
