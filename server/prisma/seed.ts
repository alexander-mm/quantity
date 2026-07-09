import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🌱 Starting database seed...");

}

main()
  .then(async () => {

    console.log("✅ Seed completed.");

    await prisma.$disconnect();

  })
  .catch(async (error) => {

    console.error(error);

    await prisma.$disconnect();

    process.exit(1);

  });