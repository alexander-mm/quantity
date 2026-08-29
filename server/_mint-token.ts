import { PrismaClient } from "@prisma/client";
import { JwtService } from "./src/shared/auth/jwt.service.js";

const prisma = new PrismaClient();

const user = await prisma.user.findFirst({
    where: { role: { name: "Administrador" } },
    include: { role: true }
});

if (!user) {
    console.error("No admin user found");
    process.exit(1);
}

const token = JwtService.generateToken({
    userId: user.id.toString(),
    username: user.username,
    roleId: user.roleId.toString(),
    roleName: user.role.name,
    storeId: user.storeId ? user.storeId.toString() : ""
});

console.log(JSON.stringify({
    accessToken: token,
    user: {
        id: user.id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId.toString(),
        roleName: user.role.name,
        storeId: user.storeId ? user.storeId.toString() : ""
    }
}));

await prisma.$disconnect();
