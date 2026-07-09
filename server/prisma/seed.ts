import { PrismaClient, StoreType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🌱 Starting database seed...");

}

main()
    .then(async () => {

        console.log("🌱 Starting database seed...");

        console.log("📦 Seeding Roles...");

        await prisma.role.upsert({
        where: {
            name: "Administrador"
        },
        update: {},
        create: {
            name: "Administrador",
            description: "Acceso total al sistema"
        }
        });

        await prisma.role.upsert({
        where: {
            name: "Tienda"
        },
        update: {},
        create: {
            name: "Tienda",
            description: "Usuario de tienda"
        }
        });

        console.log("✅ Roles created.");

        console.log("📦 Seeding Stores...");

        await prisma.store.upsert({
        where: {
            code: "MAIN"
        },
        update: {},
        create: {
            code: "MAIN",
            name: "Bodega Principal",
            type: StoreType.MAIN_WAREHOUSE,
            address: null,
            city: null,
            phone: null,
            email: null,
            manager: null
        }
        });

        console.log("✅ Store created.");

        console.log("📦 Seeding Settings...");

        const settingsCount = await prisma.settings.count();

        if (settingsCount === 0) {

        await prisma.settings.create({
            data: {
            companyName: "ORDEPLUS",
            currency: "USD",
            syncInterval: 5,
            lowStockAlerts: true
            }
        });

        }

        console.log("✅ Settings created.");
    })
    .catch(async (error) => {

        console.error(error);

        await prisma.$disconnect();

        process.exit(1);
    });