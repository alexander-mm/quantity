import { PrismaClient, Prisma, StoreType } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class AttendanceRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findStoreByIp(ip: string) {

        return this.prisma.store.findFirst({
            where: {
                attendanceIp: ip,
                isActive: true
            }
        });

    }

    async findStoreEmployees(storeId: bigint) {

        return this.prisma.user.findMany({

            where: {
                storeId,
                isActive: true,
                store: { type: StoreType.STORE }
            },

            select: {
                id: true,
                firstName: true,
                lastName: true,
                attendancePin: true
            },

            orderBy: { firstName: "asc" }

        });

    }

    async findEmployeeById(userId: bigint) {

        return this.prisma.user.findFirst({

            where: {
                id: userId,
                store: { type: StoreType.STORE }
            }

        });

    }

    async setPin(userId: bigint, hashedPin: string) {

        return this.prisma.user.update({

            where: { id: userId },

            data: { attendancePin: hashedPin },

            select: {
                id: true,
                firstName: true,
                lastName: true
            }

        });

    }

    async findEmployeeInStore(userId: bigint, storeId: bigint) {

        return this.prisma.user.findFirst({

            where: {
                id: userId,
                storeId,
                isActive: true,
                store: { type: StoreType.STORE }
            }

        });

    }

    async findOpenAttendance(userId: bigint) {

        return this.prisma.attendance.findFirst({

            where: {
                userId,
                clockOut: null
            },

            orderBy: { clockIn: "desc" }

        });

    }

    async findOpenAttendancesByStore(storeId: bigint) {

        return this.prisma.attendance.findMany({

            where: {
                storeId,
                clockOut: null
            }

        });

    }

    async clockIn(userId: bigint, storeId: bigint) {

        return this.prisma.attendance.create({

            data: {
                userId,
                storeId,
                clockIn: new Date()
            },

            include: {
                user: { select: { firstName: true, lastName: true } },
                store: { select: { id: true, name: true } }
            }

        });

    }

    async clockOut(id: bigint) {

        return this.prisma.attendance.update({

            where: { id },

            data: { clockOut: new Date() },

            include: {
                user: { select: { firstName: true, lastName: true } },
                store: { select: { id: true, name: true } }
            }

        });

    }

    async findAll(filters: {
        storeId?: bigint;
        userId?: bigint;
        from?: Date;
        to?: Date;
    }) {

        return this.prisma.attendance.findMany({

            where: {
                storeId: filters.storeId,
                userId: filters.userId,
                clockIn: (filters.from || filters.to) ? {
                    gte: filters.from,
                    lte: filters.to
                } : undefined
            },

            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
                store: { select: { id: true, name: true } }
            },

            orderBy: { clockIn: "desc" }

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): AttendanceRepository {

        return new AttendanceRepository(tx);

    }

}
