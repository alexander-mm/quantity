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
    quoteNumber: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteQuoteDialog({ open, quoteNumber, onConfirm, onCancel }: Props) {
    return (
        <AlertDialog open={open} onOpenChange={(value) => { if (!value) onCancel(); }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar cotización</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar la cotización <strong>{quoteNumber}</strong>?
                        <br /><br />
                        Esta acción no se puede deshacer.
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
