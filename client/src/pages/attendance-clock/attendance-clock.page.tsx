import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { LogIn, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/spinner";
import { useKioskContext, useClockAttendance } from "@/hooks";
import type { KioskEmployee } from "@/types";

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

function useLiveClock() {

    const [now, setNow] = useState(() => new Date());

    useEffect(() => {

        const interval = setInterval(() => setNow(new Date()), 1000);

        return () => clearInterval(interval);

    }, []);

    return now;

}

export function AttendanceClockPage() {

    const { data, isLoading, isError, error } = useKioskContext();
    const clockMutation = useClockAttendance();
    const now = useLiveClock();

    const [selectedEmployee, setSelectedEmployee] = useState<KioskEmployee | null>(null);
    const [pin, setPin] = useState("");

    const context = data?.data;
    const employees = context?.employees ?? [];

    const handleClock = () => {

        if (!selectedEmployee || pin.length !== 4) {
            return;
        }

        clockMutation.mutate({ userId: selectedEmployee.id, pin }, {
            onSuccess: (response) => {
                const timestamp = response.data.action === "clock-in"
                    ? response.data.record.clockIn
                    : (response.data.record.clockOut ?? response.data.record.clockIn);
                const time = formatTime(timestamp);
                toast.success(`${response.message} (${selectedEmployee.firstName} ${selectedEmployee.lastName}, ${time})`);
                setSelectedEmployee(null);
                setPin("");
            },
            onError: (err) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(err) && err.response?.data?.message
                        ? err.response.data.message
                        : "No se pudo registrar la marca.";
                toast.error(message);
                setPin("");
            }
        });

    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg sm:p-8">

                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Check In -Check Out</h1>
                    {context && (
                        <p className="mt-1 text-muted-foreground">{context.store.name}</p>
                    )}
                    <p className="mt-3 text-4xl font-semibold tabular-nums text-[#0170B8]">
                        {now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </p>
                    <p className="text-sm capitalize text-muted-foreground">
                        {now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </div>

                {isLoading && <LoadingState />}

                {isError && (
                    <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
                        {axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                            ? error.response.data.message
                            : "Este equipo no está autorizado para marcar asistencia."}
                    </p>
                )}

                {!isLoading && !isError && !selectedEmployee && (
                    <div className="space-y-3">
                        {employees.length === 0 && (
                            <p className="text-center text-muted-foreground">
                                Todavía no hay empleados habilitados para marcar en esta tienda.
                            </p>
                        )}
                        {employees.map(employee => (
                            <button
                                key={employee.id}
                                type="button"
                                onClick={() => setSelectedEmployee(employee)}
                                className="flex w-full items-center justify-between rounded-xl border p-4 text-left transition hover:border-primary hover:bg-primary/5"
                            >
                                <span className="text-lg font-medium">
                                    {employee.firstName} {employee.lastName}
                                </span>
                                <span className={`flex items-center gap-1.5 text-sm font-medium ${employee.clockedIn ? "text-green-600" : "text-slate-400"}`}>
                                    {employee.clockedIn ? <LogOut size={18} /> : <LogIn size={18} />}
                                    {employee.clockedIn ? "Adentro" : "Afuera"}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {!isLoading && !isError && selectedEmployee && (
                    <div className="space-y-5">

                        <button
                            type="button"
                            onClick={() => { setSelectedEmployee(null); setPin(""); }}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft size={16} />
                            Volver
                        </button>

                        <div className="text-center">
                            <p className="text-xl font-semibold">
                                {selectedEmployee.firstName} {selectedEmployee.lastName}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {selectedEmployee.clockedIn ? "Vas a marcar salida" : "Vas a marcar entrada"}
                            </p>
                        </div>

                        <div>
                            <Input
                                autoFocus
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="PIN de 4 dígitos"
                                className="text-center text-2xl tracking-[0.5em]"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && pin.length === 4) {
                                        handleClock();
                                    }
                                }}
                            />
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            disabled={pin.length !== 4 || clockMutation.isPending}
                            onClick={handleClock}
                        >
                            {clockMutation.isPending
                                ? "Registrando..."
                                : selectedEmployee.clockedIn ? "Marcar salida" : "Marcar entrada"}
                        </Button>

                    </div>
                )}

            </div>
        </div>
    );

}
