import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
    open: boolean;
    clientName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteClientDialog({ open, clientName, onConfirm, onCancel }: Props) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onCancel();
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar al cliente
                        <strong> {clientName}</strong>?
                        <br />
                        <br />
                        Las ventas ya registradas a este cliente no se verán afectadas, pero dejará de estar disponible para nuevas ventas.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
