import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { PartRepository } from "../part/part.repository.js";
import { RawMaterialRepository } from "../raw-material/raw-material.repository.js";

import { PartRecipeRepository } from "./part-recipe.repository.js";
import { SetPartRecipeDto } from "./part-recipe.dto.js";

export class PartRecipeService {

    private readonly repository = new PartRecipeRepository();
    private readonly partRepository = new PartRepository();
    private readonly rawMaterialRepository = new RawMaterialRepository();

    async findByPart(partId: string) {

        return this.repository.findByPart(BigInt(partId));

    }

    async set(partId: string, data: SetPartRecipeDto) {

        const part = await this.partRepository.findById(BigInt(partId));

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        const rawMaterial = await this.rawMaterialRepository.findById(BigInt(data.rawMaterialId));

        if (!rawMaterial) {
            throw new NotFoundError("La materia prima seleccionada no existe.");
        }

        if (rawMaterial.shape === "SHEET" && (data.pieceWidth === undefined || data.pieceHeight === undefined)) {
            throw new ValidationError("Para una lámina debe indicar el ancho y el alto de la pieza.");
        }

        if ((rawMaterial.shape === "TUBE" || rawMaterial.shape === "ROD") && data.pieceLength === undefined) {
            throw new ValidationError("Para un tubo o varilla debe indicar la longitud de la pieza.");
        }

        return this.repository.upsert(BigInt(partId), data);

    }

}
