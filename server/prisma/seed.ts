import {
  PrismaClient,  StoreType,  StockOperation} from "@prisma/client";
  import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedRoles() {
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

}

async function seedStores() {
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
}

async function seedSettings() {
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
}

async function seedUnitOfMeasure() {
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
}

async function seedMarginProfiles() {
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

}

async function seedMovementTypes() {
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

async function seedAdminUser() {
    console.log("📦 Seeding Administrator User...");

const adminRole = await prisma.role.findUnique({
  where: {
    name: "Administrador"
  }
});

const mainStore = await prisma.store.findUnique({
  where: {
    code: "MAIN"
  }
});

if (!adminRole) {
  throw new Error("Role 'Administrador' not found.");
}

if (!mainStore) {
  throw new Error("Store 'MAIN' not found.");
}

const hashedPassword = await bcrypt.hash("admin123", 10);

await prisma.user.upsert({
  where: {
    username: "admin"
  },
  update: {},
  create: {
    username: "admin",
    password: hashedPassword,
    firstName: "Administrador",
    lastName: "Sistema",
    email: "admin@ordeplus.com",
    roleId: adminRole.id,
    storeId: mainStore.id
  }
});

console.log("✅ Administrator User created.");
}

async function main() {

  console.log("🌱 Starting database seed...");

  await seedRoles();

   await seedStores();

   await seedSettings();

   await seedUnitOfMeasure();

   await seedMovementTypes();

   await seedMarginProfiles();

   await seedAdminUser();

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