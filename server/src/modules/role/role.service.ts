import { Role } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";
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

    async update(
        id: string,
        data: { name: string; description?: string; }
    ): Promise<Role> {
        const role = await this.repository.findById(BigInt(id));
        if (!role) {
            throw new NotFoundError("Rol no encontrado.");
        }
        const existingRole = await this.repository.findByName(data.name);
        if (existingRole && existingRole.id !== role.id) {
            throw new ConflictError("Ya existe un rol con ese nombre.");
        }
        return this.repository.update(BigInt(id), data);
    }

    async delete(id: string): Promise<Role> {
        const role = await this.repository.findById(BigInt(id));
        if (!role) {
            throw new NotFoundError("Rol no encontrado.");
        }
        return this.repository.delete(BigInt(id));
    }
}