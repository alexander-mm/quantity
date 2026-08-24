import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ArrowLeft, Search } from "lucide-react";
import {
    PageContainer,
    PageHeader,
    AccountsReceivableTable,
    AccountsReceivableEmptyState,
    AccountReceivableViewModal,
    EditAccountReceivableModal,
    MakeAccountReceivablePaymentModal,
    MarkPaidDialog,
    ConfirmSaleDialog
} from "@/components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getClientLabel } from "@/lib/client-label";
import {
    useClient,
    useAccountsReceivableByClient,
    useConfirmSale,
    useMarkAccountReceivablePaid
} from "@/hooks";
import type { AccountReceivable } from "@/types";

export function WholesalerDetailPage() {

    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: clientData } = useClient(clientId);
    const { data, isLoading, isError } = useAccountsReceivableByClient(clientId);

    const [search, setSearch] = useState("");
    const [itemToView, setItemToView] = useState<AccountReceivable | null>(null);
    const [itemToEdit, setItemToEdit] = useState<AccountReceivable | null>(null);
    const [itemToConfirm, setItemToConfirm] = useState<AccountReceivable | null>(null);
    const [itemToPay, setItemToPay] = useState<AccountReceivable | null>(null);
    const [itemToMarkPaid, setItemToMarkPaid] = useState<AccountReceivable | null>(null);

    const confirmMutation = useConfirmSale();
    const markPaidMutation = useMarkAccountReceivablePaid();

    const accountsReceivable = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(item => item.number.toLowerCase().includes(term));

    }, [data, search]);

    const client = clientData?.data;

    function getErrorMessage(error: unknown, fallback: string) {
        return axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
            ? error.response.data.message
            : fallback;
    }

    return (
        <PageContainer>

            <Button variant="ghost" className="mb-4 border-2 border-gray-400" onClick={() => navigate("/wholesalers")}>
                <ArrowLeft size={18} />
                Volver a Cuentas de Cobro
            </Button>

            <PageHeader
                title={client ? getClientLabel(client) : "Mayorista"}
                description="Historial de cuentas de cobro, empezando por las más recientes."
            />

            <div className="mt-6 max-w-md">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por número de cuenta de cobro..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las cuentas de cobro.</p>}
                {!isLoading && !isError && (
                    accountsReceivable.length === 0
                        ? <AccountsReceivableEmptyState />
                        : (
                            <AccountsReceivableTable
                                accountsReceivable={accountsReceivable}
                                onView={(item) => setItemToView(item)}
                                onEdit={(item) => setItemToEdit(item)}
                                onConfirmSale={(item) => setItemToConfirm(item)}
                                onMakePayment={(item) => setItemToPay(item)}
                                onMarkPaid={(item) => setItemToMarkPaid(item)}
                            />
                        )
                )}
            </div>

            <AccountReceivableViewModal
                open={!!itemToView}
                accountReceivable={itemToView}
                onOpenChange={(value) => {
                    if (!value) {
                        setItemToView(null);
                    }
                }}
            />

            <EditAccountReceivableModal
                open={!!itemToEdit}
                accountReceivable={itemToEdit}
                onOpenChange={(value) => {
                    if (!value) {
                        setItemToEdit(null);
                    }
                }}
            />

            <MakeAccountReceivablePaymentModal
                open={!!itemToPay}
                accountReceivable={itemToPay}
                onOpenChange={(value) => {
                    if (!value) {
                        setItemToPay(null);
                    }
                }}
            />

            <ConfirmSaleDialog
                open={!!itemToConfirm}
                loading={confirmMutation.isPending}
                onOpenChange={(value) => {
                    if (!value) {
                        setItemToConfirm(null);
                    }
                }}
                onConfirm={() => {
                    if (!itemToConfirm) {
                        return;
                    }
                    confirmMutation.mutate(itemToConfirm.saleId, {
                        onSuccess: () => {
                            toast.success("Venta confirmada: la cuenta de cobro queda pendiente de pago.");
                            queryClient.invalidateQueries({ queryKey: ["accounts-receivable"] });
                            setItemToConfirm(null);
                        },
                        onError: (error) => {
                            toast.error(getErrorMessage(error, "No se pudo confirmar la venta."));
                        }
                    });
                }}
            />

            <MarkPaidDialog
                open={!!itemToMarkPaid}
                loading={markPaidMutation.isPending}
                onOpenChange={(value) => {
                    if (!value) {
                        setItemToMarkPaid(null);
                    }
                }}
                onConfirm={() => {
                    if (!itemToMarkPaid) {
                        return;
                    }
                    markPaidMutation.mutate(itemToMarkPaid.id, {
                        onSuccess: () => {
                            toast.success("Cuenta de cobro marcada como pagada.");
                            setItemToMarkPaid(null);
                        },
                        onError: (error) => {
                            toast.error(getErrorMessage(error, "No se pudo marcar como pagada."));
                        }
                    });
                }}
            />

        </PageContainer>
    );
}
