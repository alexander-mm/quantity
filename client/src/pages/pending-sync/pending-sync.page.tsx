import { PageContainer, PageHeader, PendingSyncTable } from "@/components";
import { useOutboxItems } from "@/hooks";

export function PendingSyncPage() {

    const items = useOutboxItems();

    return (
        <PageContainer>

            <PageHeader
                title="Mis pendientes"
                description="Registros guardados sin conexión en este dispositivo, a la espera de sincronizarse con el servidor."
            />

            <div className="mt-8">
                {items.length === 0
                    ? (
                        <div className="rounded-xl border border-dashed p-12 text-center">
                            <h2 className="text-xl font-semibold">
                                No tienes registros pendientes
                            </h2>
                            <p className="mt-2 text-muted-foreground">
                                Todo lo que registraste ya se sincronizó con el servidor.
                            </p>
                        </div>
                    )
                    : <PendingSyncTable items={items} />
                }
            </div>

        </PageContainer>
    );

}
