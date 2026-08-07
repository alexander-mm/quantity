import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../src/database/prisma/prisma.js";

type Client = Prisma.TransactionClient;

// Orden de borrado: hijos antes que padres, para respetar las llaves foráneas.
const steps: {
    label: string;
    count: (client: Client) => Promise<number>;
    run: (client: Client) => Promise<{ count: number }>;
}[] = [
    { label: "Cuentas por cobrar", count: (c) => c.accountReceivable.count(), run: (c) => c.accountReceivable.deleteMany() },
    { label: "Detalles de venta", count: (c) => c.saleDetail.count(), run: (c) => c.saleDetail.deleteMany() },
    { label: "Ventas", count: (c) => c.sale.count(), run: (c) => c.sale.deleteMany() },
    { label: "Detalles de compra", count: (c) => c.purchaseDetail.count(), run: (c) => c.purchaseDetail.deleteMany() },
    { label: "Compras", count: (c) => c.purchase.count(), run: (c) => c.purchase.deleteMany() },
    { label: "Detalles de transferencia", count: (c) => c.stockTransferDetail.count(), run: (c) => c.stockTransferDetail.deleteMany() },
    { label: "Transferencias", count: (c) => c.stockTransfer.count(), run: (c) => c.stockTransfer.deleteMany() },
    { label: "Piezas consumidas en ensamblajes", count: (c) => c.productAssemblyPartDetail.count(), run: (c) => c.productAssemblyPartDetail.deleteMany() },
    { label: "Componentes consumidos en ensamblajes", count: (c) => c.productAssemblyDetail.count(), run: (c) => c.productAssemblyDetail.deleteMany() },
    { label: "Ensamblajes", count: (c) => c.productAssembly.count(), run: (c) => c.productAssembly.deleteMany() },
    { label: "Recetas de piezas por equipo", count: (c) => c.equipmentPart.count(), run: (c) => c.equipmentPart.deleteMany() },
    { label: "Recetas de componentes producto-producto", count: (c) => c.productComponent.count(), run: (c) => c.productComponent.deleteMany() },
    { label: "Precios por perfil de descuento", count: (c) => c.productPrice.count(), run: (c) => c.productPrice.deleteMany() },
    { label: "Movimientos de inventario", count: (c) => c.inventoryMovement.count(), run: (c) => c.inventoryMovement.deleteMany() },
    { label: "Stock por tienda", count: (c) => c.inventoryStock.count(), run: (c) => c.inventoryStock.deleteMany() },
    { label: "Productos", count: (c) => c.product.count(), run: (c) => c.product.deleteMany() },
    { label: "Categorías", count: (c) => c.category.count(), run: (c) => c.category.deleteMany() }
];

async function main() {

    const execute = process.argv.includes("--execute");

    console.log("====================================");
    console.log(execute ? "🗑️  BORRANDO catálogo de productos" : "🔍 Simulación (dry-run) — no se borra nada todavía");
    console.log("====================================\n");

    if (!execute) {

        for (const step of steps) {
            const count = await step.count(prisma);
            console.log(`${count.toString().padStart(6)}  ${step.label}`);
        }

        console.log("\nEsto NO borró nada. Para ejecutar de verdad:");
        console.log("  npx tsx scripts/wipe-product-catalog.ts --execute\n");
        return;

    }

    await prisma.$transaction(async (tx) => {

        for (const step of steps) {

            const result = await step.run(tx);
            console.log(`✅ ${step.label}: ${result.count} registro(s) eliminados.`);

        }

    });

    console.log("\n✅ Catálogo de productos y categorías vaciado por completo.");

}

main()
    .catch(error => {
        console.error("❌ Error inesperado:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
