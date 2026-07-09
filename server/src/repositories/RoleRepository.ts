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
}

