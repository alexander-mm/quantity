import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { todayLocalDateString } from "@/lib/format-date";
import { useGenerateCustomWeeklyReport } from "@/hooks";
import type { WeeklyReport } from "@/types";

type Props = {
    onGenerated: (report: WeeklyReport) => void;
};

export function CustomWeeklyReportForm({ onGenerated }: Props) {

    const [from, setFrom] = useState("");
    const [to, setTo] = useState(todayLocalDateString());

    const generateMutation = useGenerateCustomWeeklyReport();

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();

        if (!from || !to) {
            toast.error("Seleccione la fecha inicial y la fecha final.");
            return;
        }

        if (from > to) {
            toast.error("La fecha inicial no puede ser posterior a la fecha final.");
            return;
        }

        generateMutation.mutate({ from, to }, {
            onSuccess: (response) => {
                toast.success("Informe generado correctamente.");
                onGenerated(response.data);
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo generar el informe.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 rounded-lg border p-3">

            <div>
                <Label className="mb-1">Desde</Label>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} max={to || undefined} />
            </div>

            <div>
                <Label className="mb-1">Hasta</Label>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} min={from || undefined} />
            </div>

            <Button type="submit" disabled={generateMutation.isPending}>
                <FileText size={18} />
                {generateMutation.isPending ? "Generando..." : "Generar informe personalizado"}
            </Button>

        </form>
    );

}
