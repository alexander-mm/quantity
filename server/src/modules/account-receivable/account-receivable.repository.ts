import { AccountReceivable, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { CreateAccountReceivableDto, UpdateAccountReceivableDto } from "./account-receivable.dto.js";

type AccountReceivableWithRelations =
    Prisma.AccountReceivableGetPayload<{
        include: {
            client: true;
            sale: {
                include: {
                    store: true;
                    details: {
                        include: {
                            product: true;
                        };
                    };
                };
            };
            downPaymentVouchers: true;
        };
    }>;

const includeRelations = {
    client: true,
    sale: {
        include: {
            store: true,
            details: {
                include: {
                    product: true
                }
            }
        }
    },
    downPaymentVouchers: true
} as const;

export class AccountReceivableRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<AccountReceivableWithRelations[]> {

        return this.prisma.accountReceivable.findMany({

            orderBy: {
                createdAt: "desc"
            },

            include: includeRelations

        });

    }

    async findByClient(
        clientId: bigint
    ): Promise<AccountReceivableWithRelations[]> {

        return this.prisma.accountReceivable.findMany({

            where: {
                clientId
            },

            orderBy: {
                createdAt: "desc"
            },

            include: includeRelations

        });

    }

    async findById(
        id: bigint
    ): Promise<AccountReceivableWithRelations | null> {

        return this.prisma.accountReceivable.findUnique({

            where: {
                id
            },

            include: includeRelations

        });

    }

    async findPendingWithDueDate(): Promise<AccountReceivableWithRelations[]> {

        return this.prisma.accountReceivable.findMany({

            where: {
                isPaid: false,
                dueDate: { not: null }
            },

            include: includeRelations

        });

    }

    async updateLastReminderAt(
        id: bigint,
        lastReminderAt: Date
    ): Promise<void> {

        await this.prisma.accountReceivable.update({

            where: {
                id
            },

            data: {
                lastReminderAt
            }

        });

    }

    async findByNumber(
        number: string
    ): Promise<AccountReceivable | null> {

        return this.prisma.accountReceivable.findUnique({

            where: {
                number
            }

        });

    }

    async create(
        data: CreateAccountReceivableDto
    ): Promise<AccountReceivableWithRelations> {

        return this.prisma.accountReceivable.create({

            data: {
                number: data.number,
                clientId: data.clientId,
                saleId: data.saleId,
                originalAmount: data.originalAmount,
                amount: data.amount,
                currency: data.currency,
                downPayment: data.downPayment ?? 0,
                downPaymentMethod: data.downPaymentMethod,
                termDays: data.termDays,
                dueDate: data.dueDate,
                downPaymentVouchers: data.downPaymentVouchers && data.downPaymentVouchers.length > 0
                    ? {
                        create: data.downPaymentVouchers.map(number => ({ number }))
                    }
                    : undefined
            },

            include: includeRelations

        });

    }

    async update(
        id: bigint,
        data: UpdateAccountReceivableDto
    ): Promise<AccountReceivableWithRelations> {

        return this.prisma.accountReceivable.update({

            where: {
                id
            },

            data: {
                number: data.number,
                observations: data.observations
            },

            include: includeRelations

        });

    }

    async markPaid(
        id: bigint
    ): Promise<AccountReceivableWithRelations> {

        return this.prisma.accountReceivable.update({

            where: {
                id
            },

            data: {
                isPaid: true,
                paidAt: new Date()
            },

            include: includeRelations

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): AccountReceivableRepository {

        return new AccountReceivableRepository(tx);

    }

}
