import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

type Props = {
    open: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onOpenChange: (open: boolean) => void;
};

export function CancelInventoryMovementDialog({
    open,
    loading = false,
    onConfirm,
    onOpenChange
}: Props) {

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Cancelar movimiento
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        El movimiento cambiará al estado CANCELLED y no afectará el inventario.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        No
                    </AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={onConfirm}>
                        {loading ? "Cancelando..." : "Sí, cancelar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

}
