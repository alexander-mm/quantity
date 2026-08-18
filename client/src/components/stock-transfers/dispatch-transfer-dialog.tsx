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

export function DispatchTransferDialog({
    open,
    loading = false,
    onConfirm,
    onOpenChange
}: Props) {

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar despacho</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción descontará el stock de la tienda de origen y no podrá deshacerse.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={onConfirm}>
                        {loading ? "Despachando..." : "Confirmar despacho"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
