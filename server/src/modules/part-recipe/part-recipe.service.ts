import { NotFoundError } from "../../shared/errors/index.js";
import { PartRepository } from "../part/part.repository.js";
import { PartCostCalculationService } from "../part/part-cost-calculation.service.js";
import { RawMaterialRepository } from "../raw-material/raw-material.repository.js";

import { PartRecipeRepository } from "./part-recipe.repository.js";
import { SetPartRecipeDto } from "./part-recipe.dto.js";

export class PartRecipeService {

    private readonly repository = new PartRecipeRepository();
    private readonly partRepository = new PartRepository();
    private readonly rawMaterialRepository = new RawMaterialRepository();
    private readonly costCalculationService = new PartCostCalculationService();

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

        // Ancho/alto/longitud son solo referencia (no alimentan ningún cálculo) — opcionales.
        const recipe = await this.repository.upsert(BigInt(partId), data);

        const cost = this.costCalculationService.calculate(recipe, part);

        await this.partRepository.update(BigInt(partId), { cost });

        return recipe;

    }

    // La receta es opcional: si el usuario quita la materia prima de origen, se elimina en
    // vez de dejarla "huérfana" en la base. El costo vuelve a depender solo de los costos
    // adicionales de la pieza (soldadura / otro), ya que sin receta no hay costo de material.
    async remove(partId: string): Promise<void> {

        const part = await this.partRepository.findById(BigInt(partId));

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        await this.repository.delete(BigInt(partId));

        const weldingCost = part.weldingCost ? Number(part.weldingCost) : 0;
        const otherCost = part.otherCostAmount ? Number(part.otherCostAmount) : 0;

        await this.partRepository.update(BigInt(partId), { cost: weldingCost + otherCost });

    }

}
