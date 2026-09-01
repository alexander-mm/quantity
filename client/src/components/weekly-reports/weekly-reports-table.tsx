import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { formatDateOnly } from "@/lib/format-date";
import type { WeeklyReport } from "@/types";

type Props = {
    reports: WeeklyReport[];
    onView: (report: WeeklyReport) => void;
};

export function WeeklyReportsTable({ reports, onView }: Props) {

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-muted">
                        <th className="p-2 text-left">Semana</th>
                        <th className="p-2 text-left">Generado</th>
                        <th className="p-2 text-left">Envío a Telegram</th>
                        <th className="p-2 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.id} className="border-b">
                            <td className="p-2 whitespace-nowrap">
                                {formatDateOnly(report.weekStart)} - {formatDateOnly(report.weekEnd)}
                            </td>
                            <td className="p-2 whitespace-nowrap">
                                {new Date(report.createdAt).toLocaleString()}
                            </td>
                            <td className="p-2">
                                {report.telegramSent ? (
                                    <span className="flex items-center gap-1.5 text-green-600">
                                        <CheckCircle2 size={16} />
                                        Enviado
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-red-500" title={report.telegramError ?? ""}>
                                        <XCircle size={16} />
                                        {report.telegramError ?? "No enviado"}
                                    </span>
                                )}
                            </td>
                            <td className="p-2 text-center">
                                <button
                                    type="button"
                                    onClick={() => onView(report)}
                                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                                >
                                    <Eye size={16} />
                                    Ver / Imprimir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}
