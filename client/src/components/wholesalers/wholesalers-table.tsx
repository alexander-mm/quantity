import { Eye } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { formatCurrency } from "@/lib/format-currency";
import { getClientLabel } from "@/lib/client-label";
import type { Client, AccountReceivableSummary } from "@/types";

type Props = {
    wholesalers: Client[];
    summary: AccountReceivableSummary[];
    onView: (client: Client) => void;
};

export function WholesalersTable({ wholesalers, summary, onView }: Props) {

    const summaryByClient = new Map(summary.map(item => [item.clientId, item]));

    return (
        <EntityTable headers={["Cliente", "Documento", "Moneda", "Saldo pendiente", "Acciones"]}>
            {wholesalers.map(client => {

                const clientSummary = summaryByClient.get(client.id);

                return (
                    <tr key={client.id} className="border-b transition hover:bg-muted/40">
                        <td className="px-6 py-4 font-medium">{getClientLabel(client)}</td>
                        <td className="px-6 py-4">{client.document}</td>
                        <td className="px-6 py-4">{clientSummary?.currency ?? client.currency ?? "-"}</td>
                        <td className="px-6 py-4">
                            {formatCurrency(clientSummary?.total ?? 0, clientSummary?.currency ?? client.currency ?? "USD")}
                        </td>
                        <td className="px-6 py-4">
                            <Eye
                                size={18}
                                className="cursor-pointer text-slate-500 hover:text-primary"
                                onClick={() => onView(client)}
                            />
                        </td>
                    </tr>
                );

            })}
        </EntityTable>
    );
}
