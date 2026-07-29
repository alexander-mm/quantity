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
    brandName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteBrandDialog({ open, brandName, onConfirm, onCancel }: Props) {
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
                    <AlertDialogTitle>Eliminar marca</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar la marca
                        <strong> {brandName}</strong>?
                        <br />
                        <br />
                        Los productos que ya tienen esta marca no se verán afectados, pero dejará de estar disponible para nuevos productos.
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
