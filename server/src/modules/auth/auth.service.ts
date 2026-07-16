import bcrypt from "bcrypt";

import { UnauthorizedError } from "../../shared/errors/index.js";

import { JwtService } from "../../shared/auth/index.js";

import { UserRepository } from "../user/user.repository.js";

export class AuthService {

    private readonly userRepository = new UserRepository();

    async login(

        username: string,

        password: string

    ) {

        const user = await this.userRepository.findByUsername(username);

        if (!user) {

            throw new UnauthorizedError(
                "Usuario o contraseña incorrectos."
            );

        }

        const validPassword = await bcrypt.compare(

            password,

            user.password

        );

        if (!validPassword) {

            throw new UnauthorizedError(
                "Usuario o contraseña incorrectos."
            );

        }

        const token = JwtService.generateToken({

            userId: user.id.toString(),

            username: user.username,

            roleId: user.roleId.toString()

        });

        return {

            token,

            user: {

                id: user.id.toString(),

                username: user.username,

                firstName: user.firstName,

                lastName: user.lastName,

                roleId: user.roleId.toString(),

                storeId: user.storeId.toString()

            }

        };

    }

}