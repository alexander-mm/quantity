import { ProductQueryRepository } from "./product.query.repository.js";

export class ProductQueryService {

    private readonly repository =
        new ProductQueryRepository();

    async findAll() {

        return this.repository.findAll();

    }

}