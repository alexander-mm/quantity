import { NotFoundError, ConflictError, ValidationError } from "../../shared/errors/index.js";
import { QuoteRepository } from "./quote.repository.js";
import { CreateQuoteDto, UpdateQuoteDto, ConvertQuoteDto } from "./quote.dto.js";
import { SaleRepository } from "../sale/sale.repository.js";

export class QuoteService {

    private readonly repository = new QuoteRepository();
    private readonly saleRepository = new SaleRepository();

    async findAll() {
        return this.repository.findAll();
    }

    async findById(id: string) {
        const quote = await this.repository.findById(BigInt(id));
        if (!quote) {
            throw new NotFoundError("Cotización no encontrada.");
        }
        return quote;
    }

    async create(data: CreateQuoteDto) {

        const existing = await this.repository.findByNumber(data.number);

        if (existing) {
            throw new ConflictError("Ya existe una cotización con ese número.");
        }

        return this.repository.create(data);

    }

    async update(id: string, data: UpdateQuoteDto) {

        const quote = await this.repository.findById(BigInt(id));

        if (!quote) {
            throw new NotFoundError("Cotización no encontrada.");
        }

        if (quote.number !== data.number) {

            const existing = await this.repository.findByNumber(data.number);

            if (existing) {
                throw new ConflictError("Ya existe una cotización con ese número.");
            }

        }

        return this.repository.update(BigInt(id), data);

    }

    async delete(id: string) {

        const quote = await this.repository.findById(BigInt(id));

        if (!quote) {
            throw new NotFoundError("Cotización no encontrada.");
        }

        await this.repository.delete(BigInt(id));

    }

    async convert(id: string, data: ConvertQuoteDto) {

        const quote = await this.repository.findById(BigInt(id));

        if (!quote) {
            throw new NotFoundError("Cotización no encontrada.");
        }

        if (quote.convertedSaleId) {
            throw new ValidationError("Esta cotización ya fue convertida a una venta.");
        }

        const sale = await this.saleRepository.findById(BigInt(data.saleId));

        if (!sale) {
            throw new NotFoundError("La venta indicada no existe.");
        }

        return this.repository.markConverted(BigInt(id), BigInt(data.saleId));

    }

}
