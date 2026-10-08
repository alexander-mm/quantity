import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAttendanceEnrollStores, useEnrollAttendanceDevice } from "@/hooks";
import type { AttendanceEnrollStore } from "@/types";

type Props = {
    onCancel: () => void;
    onAuthorized: () => void;
};

function errorMessage(error: unknown, fallback: string): string {
    return axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
        ? error.response.data.message
        : fallback;
}

// Se usa desde el propio reloj checador (el admin entra por AnyDesk): las credenciales del
// admin solo se usan para estas dos llamadas, no se guarda ninguna sesión en el equipo.
export function AuthorizeDevicePanel({ onCancel, onAuthorized }: Props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [stores, setStores] = useState<AttendanceEnrollStore[] | null>(null);
    const [storeId, setStoreId] = useState("");
    const [name, setName] = useState("");

    const storesMutation = useAttendanceEnrollStores();
    const enrollMutation = useEnrollAttendanceDevice();

    const handleCredentials = () => {

        if (!username.trim() || !password) {
            return;
        }

        storesMutation.mutate({ username: username.trim(), password }, {
            onSuccess: (response) => setStores(response.data),
            onError: (error) => toast.error(errorMessage(error, "No se pudo validar el usuario."))
        });

    };

    const handleEnroll = () => {

        if (!storeId || !name.trim()) {
            return;
        }

        enrollMutation.mutate({ username: username.trim(), password, storeId, name: name.trim() }, {
            onSuccess: (response) => {
                toast.success(`Equipo autorizado para ${response.data.device.store.name}.`);
                setPassword("");
                onAuthorized();
            },
            onError: (error) => toast.error(errorMessage(error, "No se pudo autorizar el equipo."))
        });

    };

    return (
        <div className="space-y-5">

            <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft size={16} />
                Volver
            </button>

            <div className="text-center">
                <p className="text-xl font-semibold">Autorizar este equipo</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Solo un administrador puede autorizar el equipo de la tienda.
                </p>
            </div>

            {!stores && (
                <div className="space-y-4">
                    <div>
                        <Label className="mb-1">Usuario administrador</Label>
                        <Input
                            autoFocus
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="mb-1">Contraseña</Label>
                        <Input
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleCredentials();
                                }
                            }}
                        />
                    </div>
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={!username.trim() || !password || storesMutation.isPending}
                        onClick={handleCredentials}
                    >
                        {storesMutation.isPending ? "Validando..." : "Continuar"}
                    </Button>
                </div>
            )}

            {stores && (
                <div className="space-y-4">
                    <div>
                        <Label className="mb-1">Nombre del equipo</Label>
                        <Input
                            autoFocus
                            placeholder="Ej. PC caja San Gabriel"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="mb-1">Tienda</Label>
                        <div className="space-y-2">
                            {stores.length === 0 && (
                                <p className="text-sm text-muted-foreground">No hay tiendas activas.</p>
                            )}
                            {stores.map(store => (
                                <button
                                    key={store.id}
                                    type="button"
                                    onClick={() => setStoreId(store.id)}
                                    className={`w-full rounded-xl border p-3 text-left font-medium transition ${
                                        storeId === store.id
                                            ? "border-primary bg-primary/10"
                                            : "hover:border-primary hover:bg-primary/5"
                                    }`}
                                >
                                    {store.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={!storeId || !name.trim() || enrollMutation.isPending}
                        onClick={handleEnroll}
                    >
                        {enrollMutation.isPending ? "Autorizando..." : "Autorizar equipo"}
                    </Button>
                </div>
            )}

        </div>
    );

}
