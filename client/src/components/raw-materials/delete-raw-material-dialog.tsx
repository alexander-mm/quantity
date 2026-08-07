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
    rawMaterialName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteRawMaterialDialog({ open, rawMaterialName, onConfirm, onCancel }: Props) {
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
                    <AlertDialogTitle>Eliminar materia prima</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar
                        <strong> {rawMaterialName}</strong>?
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
