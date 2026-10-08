import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { EntityTable } from "@/components/ui";
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
import { useRevokeAttendanceDevice } from "@/hooks";
import type { AttendanceDevice } from "@/types";

type Props = {
    devices: AttendanceDevice[];
};

export function AttendanceDevicesTable({ devices }: Props) {

    const [toRevoke, setToRevoke] = useState<AttendanceDevice | null>(null);
    const revokeMutation = useRevokeAttendanceDevice();

    const handleRevoke = () => {

        if (!toRevoke) {
            return;
        }

        revokeMutation.mutate(toRevoke.id, {
            onSuccess: () => {
                toast.success(`Se quitó la autorización de "${toRevoke.name}".`);
                setToRevoke(null);
            },
            onError: () => toast.error("No se pudo quitar la autorización del equipo.")
        });

    };

    return (
        <>
            <EntityTable headers={["Equipo", "Tienda", "Autorizado", "Último uso", "Última IP", ""]}>
                {devices.map(device => (
                    <tr key={device.id} className="border-b transition hover:bg-muted/40">
                        <td className="px-6 py-4 font-medium">{device.name}</td>
                        <td className="px-6 py-4">{device.store.name}</td>
                        <td className="px-6 py-4">{format(new Date(device.createdAt), "dd/MM/yyyy HH:mm")}</td>
                        <td className="px-6 py-4">
                            {device.lastUsedAt ? format(new Date(device.lastUsedAt), "dd/MM/yyyy HH:mm") : "-"}
                        </td>
                        <td className="px-6 py-4">{device.lastIp ?? "-"}</td>
                        <td className="px-6 py-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => setToRevoke(device)}>
                                Quitar autorización
                            </Button>
                        </td>
                    </tr>
                ))}
            </EntityTable>

            <AlertDialog open={toRevoke !== null} onOpenChange={(open) => !open && setToRevoke(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Quitar autorización</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{toRevoke?.name}" dejará de poder marcar asistencia. Para volver a usarlo habrá que
                            autorizarlo de nuevo desde el propio equipo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction disabled={revokeMutation.isPending} onClick={handleRevoke}>
                            {revokeMutation.isPending ? "Quitando..." : "Quitar autorización"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );

}
