import { format } from "date-fns";
import { EntityTable } from "@/components/ui";
import type { AttendanceRecord } from "@/types";

type Props = {
    records: AttendanceRecord[];
};

function formatHoursWorked(clockIn: string, clockOut: string | null): string {

    if (!clockOut) {
        return "-";
    }

    const minutes = Math.max(
        0,
        Math.round((new Date(clockOut).getTime() - new Date(clockIn).getTime()) / 60000)
    );

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;

}

export function AttendanceHistoryTable({ records }: Props) {

    return (
        <EntityTable
            headers={["Empleado", "Tienda", "Entrada", "Salida", "Horas trabajadas"]}
        >
            {records.map(record => (
                <tr key={record.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">
                        {record.user.firstName} {record.user.lastName}
                    </td>
                    <td className="px-6 py-4">
                        {record.store.name}
                    </td>
                    <td className="px-6 py-4">
                        <div>{format(new Date(record.clockIn), "dd/MM/yyyy HH:mm")}</div>
                        {record.clockInReason && (
                            <div className="text-xs text-muted-foreground">{record.clockInReason}</div>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        {record.clockOut
                            ? (
                                <>
                                    <div>{format(new Date(record.clockOut), "dd/MM/yyyy HH:mm")}</div>
                                    {record.clockOutReason && (
                                        <div className="text-xs text-muted-foreground">{record.clockOutReason}</div>
                                    )}
                                </>
                            )
                            : <span className="text-green-600 font-medium">En turno</span>}
                    </td>
                    <td className="px-6 py-4">
                        {formatHoursWorked(record.clockIn, record.clockOut)}
                    </td>
                </tr>
            ))}
        </EntityTable>
    );

}
