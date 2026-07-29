import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    MarginProfilesToolbar,
    MarginProfilesTable,
    MarginProfilesEmptyState,
    MarginProfileModal
} from "@/components";
import { useMarginProfiles } from "@/hooks";

export function MarginProfilesPage() {

    const { data, isLoading, isError } = useMarginProfiles();
    const profiles = data?.data ?? [];
    const [open, setOpen] = useState(false);

    return (
        <PageContainer>

            <PageHeader
                title="Perfiles de margen"
                description="Administra los perfiles de margen usados para calcular precios de venta."
            />

            <div className="mt-8">
                <MarginProfilesToolbar onNewProfile={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los perfiles de margen.</p>}
                {!isLoading && !isError && (
                    profiles.length === 0
                        ? <MarginProfilesEmptyState />
                        : <MarginProfilesTable profiles={profiles} />
                )}
            </div>

            <MarginProfileModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}
