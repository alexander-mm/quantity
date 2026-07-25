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

    loading?: boolean;

    onConfirm: () => void;

    onOpenChange: (open: boolean) => void;

};

export function ConfirmSaleDialog({

    open,
    loading = false,
    onConfirm,
    onOpenChange

}: Props) {

    return (

        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <AlertDialogContent>

                <AlertDialogHeader>

                    <AlertDialogTitle>

                        Confirmar venta

                    </AlertDialogTitle>

                    <AlertDialogDescription>

                        Esta acción descontará el inventario y no podrá deshacerse.

                    </AlertDialogDescription>

                </AlertDialogHeader>

                <AlertDialogFooter>

                    <AlertDialogCancel>

                        Cancelar

                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        onClick={onConfirm}
                    >

                        {

                            loading
                                ? "Confirmando..."
                                : "Confirmar"

                        }

                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>

    );

}
