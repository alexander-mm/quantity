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

type DeleteSupplierDialogProps = {
    open: boolean;
    supplierName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteSupplierDialog({
    open,
    supplierName,
    onConfirm,
    onCancel
}: DeleteSupplierDialogProps) {

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
                        Eliminar proveedor
                    </AlertDialogTitle>

                    <AlertDialogDescription>

                        ¿Está seguro de eliminar el proveedor
                        <strong> {supplierName}</strong>?

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