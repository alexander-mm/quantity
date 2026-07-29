import { MarginProfile } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";
import { MarginProfileRepository } from "./margin-profile.repository.js";

export class MarginProfileService {

    private readonly repository = new MarginProfileRepository();

    async findAll(): Promise<MarginProfile[]> {
        return this.repository.findAll();
    }

    async findById(
        id: string
    ): Promise<MarginProfile | null> {
        return this.repository.findById(
            BigInt(id)
        );
    }

    async create(data: {
        name: string;
        percentage: number;
        displayOrder: number;
    }): Promise<MarginProfile> {
        const existingMarginProfile =
            await this.repository.findByName(
                data.name
            );
        if (existingMarginProfile) {

            throw new ConflictError(
                "Ya existe un perfil de margen con ese nombre."
            );
        }
        return this.repository.create(data);
    }

    async update(
        id: string,
        data: {
            name: string;
            percentage: number;
            displayOrder: number;
        }
    ): Promise<MarginProfile> {
        const marginProfile =
            await this.repository.findById(
                BigInt(id)
            );
        if (!marginProfile) {
            throw new NotFoundError(
                "Perfil de margen no encontrado."
            );

        }
        const existingMarginProfile =
            await this.repository.findByName(
                data.name
            );
        if (
            existingMarginProfile &&
            existingMarginProfile.id !== marginProfile.id
        ) {
            throw new ConflictError(
                "Ya existe un perfil de margen con ese nombre."
            );
        }
        return this.repository.update(
            BigInt(id),
            data
        );
    }

    async delete(
        id: string
    ): Promise<MarginProfile> {
        const marginProfile =
            await this.repository.findById(
                BigInt(id)
            );
        if (!marginProfile) {
            throw new NotFoundError(
                "Perfil de margen no encontrado."
            );
        }
        return this.repository.delete(
            BigInt(id)
        );
    }
}
