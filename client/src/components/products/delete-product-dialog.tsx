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

type DeleteProductDialogProps = {
    open: boolean;
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteProductDialog({
    open,
    productName,
    onConfirm,
    onCancel
}: DeleteProductDialogProps) {

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
                    <AlertDialogTitle>
                        Eliminar producto
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar el producto
                        <strong> {productName}</strong>?
                        <br />
                        <br />
                        Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}