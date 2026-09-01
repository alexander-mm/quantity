import { AccountReceivable, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import {
    CreateAccountReceivableDto,
    CreateAccountReceivablePaymentDto,
    UpdateAccountReceivableDto
} from "./account-receivable.dto.js";

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
            downPaymentMethods: true;
            payments: {
                include: {
                    vouchers: true;
                    paymentMethods: true;
                };
            };
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
    downPaymentVouchers: true,
    downPaymentMethods: true,
    payments: {
        include: {
            vouchers: true,
            paymentMethods: true
        },
        orderBy: {
            paymentDate: "desc"
        }
    }
} as const;

export class AccountReceivableRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(
        storeId?: bigint
    ): Promise<AccountReceivableWithRelations[]> {

        return this.prisma.accountReceivable.findMany({

            where: storeId ? { sale: { storeId } } : undefined,

            orderBy: {
                id: "desc"
            },

            include: includeRelations

        });

    }

    async findByClient(
        clientId: bigint,
        storeId?: bigint
    ): Promise<AccountReceivableWithRelations[]> {

        return this.prisma.accountReceivable.findMany({

            where: {
                clientId,
                sale: storeId ? { storeId } : undefined
            },

            orderBy: {
                id: "desc"
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
                termDays: data.termDays,
                dueDate: data.dueDate,
                downPaymentVouchers: data.downPaymentVouchers && data.downPaymentVouchers.length > 0
                    ? {
                        create: data.downPaymentVouchers.map(number => ({ number }))
                    }
                    : undefined,
                downPaymentMethods: data.downPaymentMethods && data.downPaymentMethods.length > 0
                    ? {
                        create: data.downPaymentMethods.map(entry => ({
                            method: entry.method,
                            amount: entry.amount
                        }))
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

    async findBySaleId(
        saleId: bigint
    ): Promise<AccountReceivableWithRelations | null> {

        return this.prisma.accountReceivable.findUnique({

            where: {
                saleId
            },

            include: includeRelations

        });

    }

    async upsertForSale(
        saleId: bigint,
        data: CreateAccountReceivableDto
    ): Promise<AccountReceivableWithRelations> {

        const sharedData = {
            number: data.number,
            originalAmount: data.originalAmount,
            amount: data.amount,
            currency: data.currency,
            downPayment: data.downPayment ?? 0,
            termDays: data.termDays ?? null,
            dueDate: data.dueDate ?? null
        };

        return this.prisma.accountReceivable.upsert({

            where: {
                saleId
            },

            create: {
                ...sharedData,
                clientId: data.clientId,
                saleId: data.saleId,
                downPaymentVouchers: data.downPaymentVouchers && data.downPaymentVouchers.length > 0
                    ? { create: data.downPaymentVouchers.map(number => ({ number })) }
                    : undefined,
                downPaymentMethods: data.downPaymentMethods && data.downPaymentMethods.length > 0
                    ? {
                        create: data.downPaymentMethods.map(entry => ({
                            method: entry.method,
                            amount: entry.amount
                        }))
                    }
                    : undefined
            },

            update: {
                ...sharedData,
                clientId: data.clientId,
                downPaymentVouchers: {
                    deleteMany: {},
                    create: data.downPaymentVouchers && data.downPaymentVouchers.length > 0
                        ? data.downPaymentVouchers.map(number => ({ number }))
                        : []
                },
                downPaymentMethods: {
                    deleteMany: {},
                    create: data.downPaymentMethods && data.downPaymentMethods.length > 0
                        ? data.downPaymentMethods.map(entry => ({
                            method: entry.method,
                            amount: entry.amount
                        }))
                        : []
                }
            },

            include: includeRelations

        });

    }

    async deleteBySaleId(
        saleId: bigint
    ): Promise<void> {

        const existing = await this.prisma.accountReceivable.findUnique({
            where: { saleId }
        });

        if (!existing) {
            return;
        }

        await this.prisma.accountReceivableDownPaymentVoucher.deleteMany({
            where: { accountReceivableId: existing.id }
        });

        await this.prisma.accountReceivableDownPaymentMethodEntry.deleteMany({
            where: { accountReceivableId: existing.id }
        });

        await this.prisma.accountReceivable.delete({
            where: { id: existing.id }
        });

    }

    async createPayment(
        accountReceivableId: bigint,
        data: CreateAccountReceivablePaymentDto,
        createdBy?: bigint
    ): Promise<void> {

        await this.prisma.accountReceivablePayment.create({

            data: {
                accountReceivableId,
                amount: data.amount,
                paymentDate: data.paymentDate,
                observations: data.observations,
                createdBy,
                vouchers: data.vouchers && data.vouchers.length > 0
                    ? { create: data.vouchers.map(number => ({ number })) }
                    : undefined,
                paymentMethods: {
                    create: data.paymentMethods.map(entry => ({
                        method: entry.method,
                        amount: entry.amount
                    }))
                }
            }

        });

    }

    async applyPayment(
        id: bigint,
        newAmount: number,
        isPaid: boolean
    ): Promise<AccountReceivableWithRelations> {

        return this.prisma.accountReceivable.update({

            where: {
                id
            },

            data: {
                amount: newAmount,
                isPaid,
                paidAt: isPaid ? new Date() : undefined
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
