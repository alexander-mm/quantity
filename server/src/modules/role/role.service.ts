import { Role } from "@prisma/client";

import {
    ConflictError
} from "../../shared/errors/index.js";

import { RoleRepository } from "./role.repository.js";

export class RoleService {

    private readonly repository = new RoleRepository();

    async findAll(): Promise<Role[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<Role | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async create(data: {

        name: string;

        description?: string;

    }): Promise<Role> {

        const existingRole =
            await this.repository.findByName(
                data.name
            );

        if (existingRole) {

            throw new ConflictError(
                "Ya existe un rol con ese nombre."
            );

        }

        return this.repository.create(data);

    }

}