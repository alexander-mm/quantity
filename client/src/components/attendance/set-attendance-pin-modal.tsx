import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetAttendancePin } from "@/hooks";
import type { User } from "@/types";

type Props = {
    open: boolean;
    user: User | null;
    onOpenChange: (open: boolean) => void;
};

export function SetAttendancePinModal({ open, user, onOpenChange }: Props) {

    const [pin, setPin] = useState("");
    const mutation = useSetAttendancePin();

    if (!user) {
        return null;
    }

    const handleSubmit = () => {

        if (pin.length !== 4) {
            return;
        }

        mutation.mutate({ userId: user.id, pin }, {
            onSuccess: () => {
                toast.success("PIN de asistencia configurado.");
                setPin("");
                onOpenChange(false);
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo configurar el PIN.";
                toast.error(message);
            }
        });

    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    setPin("");
                }
                onOpenChange(value);
            }}
        >
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>PIN de asistencia</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {user.firstName} {user.lastName} — se usa para marcar entrada/salida en el reloj checador de {user.store.name}.
                    </p>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label className="mb-1">Nuevo PIN (4 dígitos)</Label>
                        <Input
                            autoFocus
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            className="text-center text-xl tracking-[0.5em]"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            disabled={pin.length !== 4 || mutation.isPending}
                            onClick={handleSubmit}
                        >
                            {mutation.isPending ? "Guardando..." : "Guardar PIN"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

}
