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

export function DeleteCuttingOrderDialog({ open, loading = false, onConfirm, onOpenChange }: Props) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar orden de corte</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta orden está en borrador y aún no afectó el inventario, así que se puede eliminar
                        sin riesgo.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={onConfirm}>
                        {loading ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
