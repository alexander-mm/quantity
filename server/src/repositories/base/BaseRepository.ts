import { prisma } from "../../database/index.js";

export abstract class BaseRepository {

    protected readonly prisma = prisma;

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