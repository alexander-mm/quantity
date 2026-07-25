import { StoreQueryRepository } from "./store.query.repository.js";

export class StoreQueryService {

    private readonly repository =
        new StoreQueryRepository();

    async findAll() {
        return this.repository.findAll();
    }
}