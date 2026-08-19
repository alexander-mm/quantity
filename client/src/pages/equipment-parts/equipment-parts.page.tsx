import { useState } from "react";
import { PageContainer, PageHeader } from "@/components";
import { EquipmentProductionSection } from "@/components/equipment-parts";
import { PartProductionSection } from "@/components/part-production";
import { Button } from "@/components/ui/button";

export function EquipmentPartsPage() {

    const [kind, setKind] = useState<"EQUIPMENT" | "PART">("EQUIPMENT");

    return (
        <PageContainer>

            <PageHeader
                title="Cálculo de producción"
                description="Calcula cuánto material y cuántos componentes hacen falta para producir un equipo o una pieza."
            />

            <div className="mt-6 flex gap-2">
                <Button
                    type="button"
                    variant={kind === "EQUIPMENT" ? "default" : "outline"}
                    onClick={() => setKind("EQUIPMENT")}
                >
                    Equipos
                </Button>
                <Button
                    type="button"
                    variant={kind === "PART" ? "default" : "outline"}
                    onClick={() => setKind("PART")}
                >
                    Piezas
                </Button>
            </div>

            {kind === "EQUIPMENT" ? <EquipmentProductionSection /> : <PartProductionSection />}

        </PageContainer>
    );
}
