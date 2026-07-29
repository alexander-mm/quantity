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
    profileName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteMarginProfileDialog({ open, profileName, onConfirm, onCancel }: Props) {
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
                    <AlertDialogTitle>Eliminar perfil de margen</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar el perfil
                        <strong> {profileName}</strong>?
                        <br />
                        <br />
                        Los productos que ya tienen un precio calculado con este perfil no se verán afectados, pero el perfil dejará de estar disponible para nuevos productos.
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