import { useMemo, useState } from "react";
import {
    PageContainer,
    PageHeader,
    AttendanceHistoryTable
} from "@/components";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui";
import { StoreSelector } from "@/components/selectors/store-selector";
import { useAttendanceHistory, useStores, usePagination } from "@/hooks";
import { LoadingState } from "@/components/ui/spinner";

export function AttendanceHistoryPage() {

    const [storeId, setStoreId] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const { data: storesData } = useStores();
    const stores = storesData?.data ?? [];

    const { data, isLoading, isError } = useAttendanceHistory({
        storeId: storeId || undefined,
        from: from ? `${from}T00:00:00` : undefined,
        to: to ? `${to}T23:59:59` : undefined
    });

    const records = useMemo(() => data?.data ?? [], [data]);

    const { pageItems: pagedRecords, page, setPage, totalPages, totalItems, pageSize } = usePagination(records);

    return (
        <PageContainer>

            <PageHeader
                title="Asistencia de tiendas"
                description="Historial de entradas y salidas marcadas en el reloj checador de cada tienda."
            />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StoreSelector
                    stores={stores}
                    value={storeId}
                    label="Tienda"
                    placeholder="Todas las tiendas"
                    onChange={(value) => setStoreId(value ?? "")}
                />
                <div>
                    <Label className="mb-1">Desde</Label>
                    <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div>
                    <Label className="mb-1">Hasta</Label>
                    <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar el historial de asistencia.</p>}
                {!isLoading && !isError && (
                    records.length === 0
                        ? <p className="text-muted-foreground">No hay marcas de asistencia para el filtro seleccionado.</p>
                        : (
                            <>
                                <AttendanceHistoryTable records={pagedRecords} />
                                <PaginationControls
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    totalItems={totalItems}
                                    pageSize={pageSize}
                                />
                            </>
                        )
                )}
            </div>

        </PageContainer>
    );

}
