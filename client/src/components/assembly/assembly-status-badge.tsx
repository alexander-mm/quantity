import { Badge } from "@/components/ui/badge";

type Props = {
    status: "DRAFT" | "CONFIRMED" | "CANCELLED";
};

export function AssemblyStatusBadge({ status }: Props) {

    switch (status) {

        case "DRAFT":
            return <Badge variant="secondary">Borrador</Badge>;

        case "CONFIRMED":
            return <Badge className="bg-green-600 hover:bg-green-700">Confirmado</Badge>;

        case "CANCELLED":
            return <Badge variant="destructive">Cancelado</Badge>;

        default:
            return <Badge variant="outline">{status}</Badge>;

    }

}
