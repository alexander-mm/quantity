import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarginProfileForm } from "./margin-profile-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    profileId?: string;
};

export function MarginProfileModal({ open, onOpenChange, mode = "create", profileId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Nuevo perfil de margen" : "Editar perfil de margen"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Registra un nuevo perfil de descuento."
                            : "Modifica el perfil de descuento."}
                    </DialogDescription>
                </DialogHeader>
                <MarginProfileForm
                    mode={mode}
                    profileId={profileId}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
