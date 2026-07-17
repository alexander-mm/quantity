import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "../../database/index.js";

export abstract class BaseRepository {

    protected readonly prisma: PrismaClient | Prisma.TransactionClient;

    constructor(

        prismaClient: PrismaClient | Prisma.TransactionClient = prisma

    ) {

        this.prisma = prismaClient;

    }

    protected getCurrentDate(): Date {

        return new Date();

    }

    protected buildSoftDeleteData(userId?: bigint) {

        return {

            isActive: false,

            updatedAt: this.getCurrentDate(),

            updatedBy: userId

        };

    }

    protected buildRestoreData(userId?: bigint) {

        return {

            isActive: true,

            updatedAt: this.getCurrentDate(),

            updatedBy: userId

        };

    }

}