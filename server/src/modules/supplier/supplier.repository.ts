import { Supplier, Prisma, PrismaClient } from "@prisma/client";
import { CreateSupplierDto, UpdateSupplierDto } from "./supplier.dto.js";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class SupplierRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<Supplier[]> {
        return this.prisma.supplier.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                companyName: "asc"
            }
        });
    }

    async findById(
        id: bigint
    ): Promise<Supplier | null> {
        return this.prisma.supplier.findFirst({
            where: {
                id,
                isActive: true
            }
        });
    }

    async findByUuid(
        uuid: string
    ): Promise<Supplier | null> {
        return this.prisma.supplier.findFirst({
            where: {
                uuid,
                isActive: true
            }
        });
    }

    async findByCode(
        code: string
    ): Promise<Supplier | null> {
        return this.prisma.supplier.findFirst({
            where: {
                code,
                isActive: true
            }
        });
    }

    async create(
        data: CreateSupplierDto
    ): Promise<Supplier> {
        return this.prisma.supplier.create({
            data
        });
    }

    async update(
        id: bigint,
        data: UpdateSupplierDto
    ): Promise<Supplier> {
        return this.prisma.supplier.update({
            where: { id },
            data
        });
    }

    async delete(
        id: bigint
    ): Promise<Supplier> {
        return this.prisma.supplier.update({
            where: { id },
            data: {
                isActive: false
            }
        });
    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): SupplierRepository {
        return new SupplierRepository(tx);
    }

}