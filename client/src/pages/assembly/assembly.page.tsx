import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    ProductAssemblySection,
    PartAssemblySection
} from "@/components";
import { Button } from "@/components/ui/button";

export function AssemblyPage() {

    const [kind, setKind] = useState<"PRODUCT" | "PART">("PRODUCT");

    return (
        <PageContainer>

            <PageHeader
                title="Ensamblaje"
                description="Arma productos y piezas terminados a partir de sus componentes, descontando de bodega    
  principal y del inventario de piezas."
            />

            <div className="mt-6 flex gap-2">
                <Button
                    type="button"
                    variant={kind === "PRODUCT" ? "default" : "outline"}
                    onClick={() => setKind("PRODUCT")}
                >
                    Productos
                </Button>
                <Button
                    type="button"
                    variant={kind === "PART" ? "default" : "outline"}
                    onClick={() => setKind("PART")}
                >
                    Piezas
                </Button>
            </div>

            {kind === "PRODUCT" ? <ProductAssemblySection /> : <PartAssemblySection />}

        </PageContainer>
    );
}