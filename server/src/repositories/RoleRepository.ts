import { Role } from "@prisma/client";

import { BaseRepository } from "./base/BaseRepository.js";

export class RoleRepository extends BaseRepository {

    async findAll(): Promise<Role[]> {
        return this.prisma.role.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: "asc"
            }
        });
    }
    

    async findById(id: bigint): Promise<Role | null> {
        return this.prisma.role.findUnique({
            where: {
                id
            }
        })
    }


    async findByUuid(uuid: string): Promise<Role | null> {
        return this.prisma.role.findUnique({
            where: {
                uuid
            }
        });
    }

    async exists(id: bigint): Promise<boolean> {
        const count = await this.prisma.role.count({
            where: {
                id,
                isActive: true
            }
        });
        return count > 0;
    }

}

