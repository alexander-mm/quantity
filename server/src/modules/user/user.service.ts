import bcrypt from "bcrypt";

import { User } from "@prisma/client";

import {
    ConflictError,
    NotFoundError
} from "../../shared/errors/index.js";

import { UserRepository } from "./user.repository.js";
import { RoleRepository } from "../role/role.repository.js";
import { StoreRepository } from "../store/store.repository.js";

export class UserService {

    private readonly repository = new UserRepository();

    private readonly roleRepository = new RoleRepository();

    private readonly storeRepository = new StoreRepository();

    async findAll(): Promise<User[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<User | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async create(data: {

        username: string;

        password: string;

        firstName: string;

        lastName: string;

        email?: string;

        phone?: string;

        roleId: bigint;

        storeId: bigint;

    }): Promise<User> {

        const existingUsername =
            await this.repository.findByUsername(data.username);

        if (existingUsername) {

            throw new ConflictError(
                "Ya existe un usuario con ese nombre."
            );

        }

        if (data.email) {

            const existingEmail =
                await this.repository.findByEmail(data.email);

            if (existingEmail) {

                throw new ConflictError(
                    "Ya existe un usuario con ese correo."
                );

            }

        }

        const role =
            await this.roleRepository.findById(data.roleId);

        if (!role) {

            throw new NotFoundError(
                "El rol no existe."
            );

        }

        const store =
            await this.storeRepository.findById(data.storeId);

        if (!store) {

            throw new NotFoundError(
                "La tienda no existe."
            );

        }

        const hashedPassword =
            await bcrypt.hash(
                data.password,
                10
            );

        return this.repository.create({

            ...data,

            password: hashedPassword

        });

    }

}