import {
  PrismaClient,
  StoreType,
  StockOperation
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🌱 Starting database seed...");

  // =============================
  // Roles
  // =============================

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

  // =============================
  // Store
  // =============================

  console.log("📦 Seeding Store...");

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

  // =============================
  // Settings
  // =============================

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

  // =============================
  // Unit Of Measure
  // =============================

  console.log("📦 Seeding Unit Of Measure...");

  await prisma.unitOfMeasure.upsert({
    where: {
      code: "UN"
    },
    update: {},
    create: {
      code: "UN",
      name: "Unidad",
      description: "Unidad de medida por defecto"
    }
  });

  console.log("✅ Unit Of Measure created.");

  // =============================
// Margin Profiles
// =============================

const marginProfiles = [
  {
    name: "Precio 1",
    percentage: 30.00,
    displayOrder: 1
  },
  {
    name: "Precio 2",
    percentage: 40.00,
    displayOrder: 2
  }
];

console.log("📦 Seeding Margin Profiles...");

for (const profile of marginProfiles) {

  await prisma.marginProfile.upsert({
    where: {
      name: profile.name
    },
    update: {},
    create: {
      name: profile.name,
      percentage: profile.percentage,
      displayOrder: profile.displayOrder
    }
  });

}

console.log("✅ Margin Profiles created.");

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
    }
  ];

  console.log("📦 Seeding Movement Types...");

for (const movementType of movementTypes) {

  await prisma.movementType.upsert({
    where: {
      code: movementType.code
    },
    update: {},
    create: movementType
  });

}

console.log("✅ Movement Types created.");

}

main()
  .then(async () => {

    console.log("🎉 Database seeded successfully.");

    await prisma.$disconnect();

  })
  .catch(async (error) => {

    console.error(error);

    await prisma.$disconnect();

    process.exit(1);

  });