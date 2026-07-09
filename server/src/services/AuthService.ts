import bcrypt from "bcrypt";

import { UserRepository } from "../repositories/UserRepository.js";

export class AuthService {

    private readonly userRepository = new UserRepository();

    async login(username: string, password: string) {

        const user = await this.userRepository.findByUsername(username);

        if (!user) {
            return null;
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return null;
        }

        return user;

    }

}