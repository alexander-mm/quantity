-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'TRANSFER', 'CREDIT');

-- AlterTable: Sale
ALTER TABLE "public"."Sale" ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'CASH';

-- Backfill: ventas que ya tienen cuenta de cobro asociada eran, de hecho, ventas a credito.
UPDATE "public"."Sale"
SET "paymentMethod" = 'CREDIT'
WHERE "id" IN (SELECT "saleId" FROM "public"."AccountReceivable");

-- CreateTable
CREATE TABLE "public"."SaleTransferVoucher" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "saleId" BIGINT NOT NULL,
    "number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleTransferVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaleTransferVoucher_uuid_key" ON "public"."SaleTransferVoucher"("uuid");

-- CreateIndex
CREATE INDEX "SaleTransferVoucher_saleId_idx" ON "public"."SaleTransferVoucher"("saleId");

-- AddForeignKey
ALTER TABLE "public"."SaleTransferVoucher" ADD CONSTRAINT "SaleTransferVoucher_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: AccountReceivable
ALTER TABLE "public"."AccountReceivable" ADD COLUMN     "originalAmount" DECIMAL(12,2);

-- Backfill: para cuentas de cobro existentes, el monto pendiente ya era el total (no existia abono).
UPDATE "public"."AccountReceivable" SET "originalAmount" = "amount";

ALTER TABLE "public"."AccountReceivable" ALTER COLUMN "originalAmount" SET NOT NULL;

ALTER TABLE "public"."AccountReceivable" ADD COLUMN     "downPayment" DECIMAL(12,2) NOT NULL DEFAULT 0;
ALTER TABLE "public"."AccountReceivable" ADD COLUMN     "downPaymentMethod" "public"."PaymentMethod";
ALTER TABLE "public"."AccountReceivable" ADD COLUMN     "termDays" INTEGER;
ALTER TABLE "public"."AccountReceivable" ADD COLUMN     "dueDate" TIMESTAMP(3);
ALTER TABLE "public"."AccountReceivable" ADD COLUMN     "lastReminderAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "AccountReceivable_dueDate_idx" ON "public"."AccountReceivable"("dueDate");

-- CreateTable
CREATE TABLE "public"."AccountReceivableDownPaymentVoucher" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "accountReceivableId" BIGINT NOT NULL,
    "number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountReceivableDownPaymentVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountReceivableDownPaymentVoucher_uuid_key" ON "public"."AccountReceivableDownPaymentVoucher"("uuid");

-- CreateIndex
CREATE INDEX "AccountReceivableDownPaymentVoucher_accountReceivableId_idx" ON "public"."AccountReceivableDownPaymentVoucher"("accountReceivableId");

-- AddForeignKey
ALTER TABLE "public"."AccountReceivableDownPaymentVoucher" ADD CONSTRAINT "AccountReceivableDownPaymentVoucher_accountReceivableId_fkey" FOREIGN KEY ("accountReceivableId") REFERENCES "public"."AccountReceivable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
