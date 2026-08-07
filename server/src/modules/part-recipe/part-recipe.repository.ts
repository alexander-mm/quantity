import { PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { SetPartRecipeDto } from "./part-recipe.dto.js";

type PartRecipeWithRelations =
    Prisma.PartRecipeGetPayload<{
        include: {
            rawMaterial: true;
        };
    }>;

export class PartRecipeRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findByPart(
        partId: bigint
    ): Promise<PartRecipeWithRelations | null> {

        return this.prisma.partRecipe.findUnique({

            where: {
                partId
            },

            include: {
                rawMaterial: true
            }

        });

    }

    async upsert(
        partId: bigint,
        data: SetPartRecipeDto
    ): Promise<PartRecipeWithRelations> {

        return this.prisma.partRecipe.upsert({

            where: {
                partId
            },

            create: {
                partId,
                rawMaterialId: BigInt(data.rawMaterialId),
                pieceWidth: data.pieceWidth ?? null,
                pieceHeight: data.pieceHeight ?? null,
                pieceLength: data.pieceLength ?? null,
                piecesPerUnit: data.piecesPerUnit
            },

            update: {
                rawMaterialId: BigInt(data.rawMaterialId),
                pieceWidth: data.pieceWidth ?? null,
                pieceHeight: data.pieceHeight ?? null,
                pieceLength: data.pieceLength ?? null,
                piecesPerUnit: data.piecesPerUnit
            },

            include: {
                rawMaterial: true
            }

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): PartRecipeRepository {

        return new PartRecipeRepository(tx);

    }

}
