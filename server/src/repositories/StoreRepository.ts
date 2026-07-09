import { Store } from "@prisma/client";

import { BaseRepository } from "./base/BaseRepository.js";

export class StoreRepository extends BaseRepository {

    async findAll(): Promise<Store[]> {

        return this.prisma.store.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                name: "asc"
            }

        });

    }

    async findById(id: bigint): Promise<Store | null> {

        return this.prisma.store.findUnique({

            where: {
                id
            }

        });

    }

    async findByUuid(uuid: string): Promise<Store | null> {

        return this.prisma.store.findUnique({

            where: {
                uuid
            }

        });

    }

}