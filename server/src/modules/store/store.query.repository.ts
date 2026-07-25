import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class StoreQueryRepository extends BaseRepository {

    async findAll() {

        return this.prisma.store.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                code: true,
                name: true,
                type: true,
                city: true,
                manager: true,
                phone: true,
                isActive: true
            },
            orderBy: {
                name: "asc"
            }
        });
    }
}