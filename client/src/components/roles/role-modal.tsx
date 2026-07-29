import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleForm } from "./role-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "create" | "edit";
    roleId?: string;
};

export function RoleModal({ open, onOpenChange, mode = "create", roleId }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Nuevo rol" : "Editar rol"}</DialogTitle>
                </DialogHeader>
                <RoleForm mode={mode} roleId={roleId} onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}