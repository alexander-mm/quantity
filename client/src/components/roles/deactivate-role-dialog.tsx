import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
    open: boolean;
    roleName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeactivateRoleDialog({ open, roleName, onConfirm, onCancel }: Props) {
    return (
        <AlertDialog open={open} onOpenChange={(value) => { if (!value) onCancel(); }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Desactivar rol</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de desactivar el rol <strong>{roleName}</strong>?
                        <br /><br />
                        Los usuarios que ya lo tienen asignado no se verán afectados, pero el rol dejará de estar disponible para nuevos usuarios.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Desactivar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
