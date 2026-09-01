import { PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export type CreateWeeklyReportDto = {
    weekStart: Date;
    weekEnd: Date;
    pdf: Buffer;
    telegramSent: boolean;
    telegramError?: string;
};

const listSelect = {
    id: true,
    uuid: true,
    weekStart: true,
    weekEnd: true,
    telegramSent: true,
    telegramError: true,
    createdAt: true
} as const;

export class WeeklyReportRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async create(data: CreateWeeklyReportDto) {

        return this.prisma.weeklyReport.create({
            data: {
                weekStart: data.weekStart,
                weekEnd: data.weekEnd,
                pdf: data.pdf,
                telegramSent: data.telegramSent,
                telegramError: data.telegramError
            },
            select: listSelect
        });

    }

    async findAll() {

        return this.prisma.weeklyReport.findMany({
            orderBy: { weekStart: "desc" },
            select: listSelect
        });

    }

    async findPdfById(id: bigint) {

        return this.prisma.weeklyReport.findUnique({
            where: { id },
            select: { pdf: true, weekStart: true, weekEnd: true }
        });

    }

}
