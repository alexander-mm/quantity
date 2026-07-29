import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarginProfileForm } from "./margin-profile-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function MarginProfileModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nuevo perfil de margen</DialogTitle>
                </DialogHeader>
                <MarginProfileForm onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
