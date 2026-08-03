import { Badge } from "@/components/ui/badge";

type Props = { status: string; };

export function StockTransferStatusBadge({ status }: Props) {
    switch (status) {
        case "PENDING":
            return <Badge variant="secondary">Pendiente</Badge>;
        case "RECEIVED":
            return <Badge className="bg-green-600 hover:bg-green-700">Recibido</Badge>;
        case "WITH_ISSUES":
            return <Badge className="bg-amber-500 hover:bg-amber-600">Con novedad</Badge>;
        case "CANCELLED":
            return <Badge variant="destructive">Cancelado</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
