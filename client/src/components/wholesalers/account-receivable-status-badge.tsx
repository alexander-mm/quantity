import { Badge } from "@/components/ui/badge";
import type { AccountReceivable } from "@/types";

type Props = {
    accountReceivable: AccountReceivable;
};

export function AccountReceivableStatusBadge({ accountReceivable }: Props) {

    const saleStatus = accountReceivable.sale.status;

    if (saleStatus === "CANCELLED") {
        return <Badge variant="destructive">Venta cancelada</Badge>;
    }

    if (saleStatus === "DRAFT") {
        return <Badge variant="secondary">Borrador</Badge>;
    }

    if (accountReceivable.isPaid) {
        return <Badge className="bg-green-600 hover:bg-green-700">Pagada</Badge>;
    }

    return <Badge className="bg-amber-600 hover:bg-amber-700">Pendiente</Badge>;

}
