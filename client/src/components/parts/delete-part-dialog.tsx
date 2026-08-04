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
    partName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeletePartDialog({ open, partName, onConfirm, onCancel }: Props) {
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
                    <AlertDialogTitle>Eliminar pieza</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar la pieza
                        <strong> {partName}</strong>?
                        <br />
                        <br />
                        Solo se puede eliminar si no tiene stock disponible (cantidad en 0).
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
