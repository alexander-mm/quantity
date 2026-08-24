import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks";
import { ROLES } from "@/constants/roles";
import { connectSocket, disconnectSocket } from "@/lib";

type SaleConfirmedPayload = {
    number: string;
    storeName: string;
    clientName: string;
    currency: string;
    total: string;
};

type StockLowPayload = {
    productName: string;
    storeName: string;
    quantity: number;
    minimumStock: number;
};

type CuttingOrderConfirmedPayload = {
    number: string;
    partName: string;
    goodPieces: number;
    userName: string;
};

type PriceChangedPayload = {
    productName: string;
};

// Notificaciones en vivo (ventas, stock bajo, órdenes de corte, cambios de
// precio) solo para Administrador — el servidor rechaza la conexión de
// cualquier otro rol en el handshake, así que ni se intenta conectar.
export function RealtimeNotifications() {

    const { isAuthenticated, accessToken, user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {

        if (!isAuthenticated || !accessToken || user?.roleName !== ROLES.ADMIN) {
            return;
        }

        const socket = connectSocket(accessToken);

        socket.on("sale:confirmed", (data: SaleConfirmedPayload) => {

            toast(
                `🟢 Venta ${data.number} confirmada en ${data.storeName} (${data.clientName}) — ${data.currency} ${Number(data.total).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            );

            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });

        });

        socket.on("stock:low", (data: StockLowPayload) => {

            toast(
                `⚠️ Stock bajo: ${data.productName} en ${data.storeName} (${data.quantity}/${data.minimumStock})`,
                { icon: "⚠️" }
            );

            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });

        });

        socket.on("cutting-order:confirmed", (data: CuttingOrderConfirmedPayload) => {

            toast(
                `🔧 Orden de corte ${data.number} confirmada: ${data.goodPieces} pieza(s) de "${data.partName}" por ${data.userName}`
            );

            queryClient.invalidateQueries({ queryKey: ["part-cutting-orders"] });
            queryClient.invalidateQueries({ queryKey: ["parts"] });

        });

        socket.on("product:price-changed", (data: PriceChangedPayload) => {

            toast(`💲 Precio actualizado: ${data.productName}`);

            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product-price-entries"] });
            queryClient.invalidateQueries({ queryKey: ["product-price-entry-labels"] });

        });

        return () => {
            disconnectSocket();
        };

    }, [isAuthenticated, accessToken, user?.roleName, queryClient]);

    return null;

}
