import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { prisma } from "../../database/index.js";

import { AccountReceivableRepository } from "./account-receivable.repository.js";
import { CreateAccountReceivablePaymentDto, UpdateAccountReceivableDto } from "./account-receivable.dto.js";

export class AccountReceivableService {

    private readonly repository = new AccountReceivableRepository();

    async findAll() {
        return this.repository.findAll();
    }

    async findByClient(clientId: string) {
        return this.repository.findByClient(BigInt(clientId));
    }

    async findPendingWithDueDate() {
        return this.repository.findPendingWithDueDate();
    }

    async markReminderSent(id: bigint) {
        return this.repository.updateLastReminderAt(id, new Date());
    }

    async findById(id: string) {

        const accountReceivable = await this.repository.findById(BigInt(id));

        if (!accountReceivable) {
            throw new NotFoundError("Cuenta de cobro no encontrada.");
        }

        return accountReceivable;

    }

    async update(id: string, data: UpdateAccountReceivableDto) {

        const accountReceivable = await this.repository.findById(BigInt(id));

        if (!accountReceivable) {
            throw new NotFoundError("Cuenta de cobro no encontrada.");
        }

        if (accountReceivable.sale.status !== "DRAFT") {
            throw new ValidationError(
                "Solo se puede editar mientras la venta asociada no se haya confirmado."
            );
        }

        const existing = await this.repository.findByNumber(data.number);

        if (existing && existing.id !== accountReceivable.id) {
            throw new ValidationError("Ya existe una cuenta de cobro con ese número.");
        }

        return this.repository.update(accountReceivable.id, data);

    }

    async markPaid(id: string) {

        const accountReceivable = await this.repository.findById(BigInt(id));

        if (!accountReceivable) {
            throw new NotFoundError("Cuenta de cobro no encontrada.");
        }

        if (accountReceivable.sale.status !== "CONFIRMED") {
            throw new ValidationError(
                "Debe confirmar la venta asociada antes de poder marcar la cuenta de cobro como pagada."
            );
        }

        if (accountReceivable.isPaid) {
            throw new ValidationError("Esta cuenta de cobro ya está pagada.");
        }

        return this.repository.markPaid(accountReceivable.id);

    }

    async createPayment(
        id: string,
        data: CreateAccountReceivablePaymentDto,
        requestingUserId?: string
    ) {

        const accountReceivable = await this.repository.findById(BigInt(id));

        if (!accountReceivable) {
            throw new NotFoundError("Cuenta de cobro no encontrada.");
        }

        if (accountReceivable.sale.status !== "CONFIRMED") {
            throw new ValidationError(
                "Debe confirmar la venta asociada antes de poder registrar abonos."
            );
        }

        if (accountReceivable.isPaid) {
            throw new ValidationError("Esta cuenta de cobro ya está pagada.");
        }

        const currentAmount = Number(accountReceivable.amount);

        if (data.amount > currentAmount) {
            throw new ValidationError(
                `El abono (${data.amount}) no puede ser mayor que el saldo pendiente (${currentAmount}).`
            );
        }

        const newAmount = currentAmount - data.amount;
        const isPaid = newAmount <= 0;

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);

            await repository.createPayment(
                accountReceivable.id,
                data,
                requestingUserId ? BigInt(requestingUserId) : undefined
            );

            return repository.applyPayment(
                accountReceivable.id,
                newAmount,
                isPaid
            );

        });

    }

    async getSummary() {

        const all = await this.repository.findAll();

        const pending = all.filter(item => !item.isPaid && item.sale.status === "CONFIRMED");

        const totals = new Map<string, { clientId: string; currency: string; total: number }>();

        for (const item of pending) {

            const key = item.clientId.toString();
            const current = totals.get(key) ?? {
                clientId: key,
                currency: item.currency,
                total: 0
            };

            current.total += Number(item.amount);
            totals.set(key, current);

        }

        return Array.from(totals.values());

    }

}
