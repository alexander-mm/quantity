import { StockOperation } from "@prisma/client";
import { prisma } from "../src/database/index.js";

const movementTypes = [
    {
        code: "PURCHASE",
        name: "Compra",
        description: "Ingreso por compra",
        affectsStock: true,
        stockOperation: StockOperation.IN
    },
    {
        code: "SALE",
        name: "Venta",
        description: "Salida por venta",
        affectsStock: true,
        stockOperation: StockOperation.OUT
    },
    {
        code: "TRANSFER_OUT",
        name: "Transferencia Salida",
        description: "Salida hacia otra tienda",
        affectsStock: true,
        stockOperation: StockOperation.OUT
    },
    {
        code: "TRANSFER_IN",
        name: "Transferencia Entrada",
        description: "Ingreso desde otra tienda",
        affectsStock: true,
        stockOperation: StockOperation.IN
    },
    {
        code: "STAFF_DELIVERY",
        name: "Entrega a Personal",
        description: "Entrega de productos al personal",
        affectsStock: true,
        stockOperation: StockOperation.OUT
    },
    {
        code: "ADJUSTMENT_IN",
        name: "Ajuste Positivo",
        description: "Ajuste de inventario positivo",
        affectsStock: true,
        stockOperation: StockOperation.IN
    },
    {
        code: "ADJUSTMENT_OUT",
        name: "Ajuste Negativo",
        description: "Ajuste de inventario negativo",
        affectsStock: true,
        stockOperation: StockOperation.OUT
    },
    {
        code: "ASSEMBLY_IN",
        name: "Ensamblaje Entrada",
        description: "Ingreso de producto terminado por ensamblaje",
        affectsStock: true,
        stockOperation: StockOperation.IN
    },
    {
        code: "ASSEMBLY_OUT",
        name: "Ensamblaje Salida",
        description: "Salida de componente consumido en ensamblaje",
        affectsStock: true,
        stockOperation: StockOperation.OUT
    },
    {
        code: "INITIAL_LOAD",
        name: "Carga Inicial",
        description: "Carga inicial de inventario (importación)",
        affectsStock: true,
        stockOperation: StockOperation.IN
    }
];

async function main() {

    for (const movementType of movementTypes) {

        await prisma.movementType.upsert({
            where: { code: movementType.code },
            update: {},
            create: movementType
        });

    }

    const count = await prisma.movementType.count();
    console.log(`Listo. Tipos de movimiento en la base: ${count}.`);

}

main().then(() => process.exit(0)).catch(err => {
    console.error("ERROR:", err);
    process.exit(1);
});
