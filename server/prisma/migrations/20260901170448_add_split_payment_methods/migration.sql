-- AlterEnum
ALTER TYPE "public"."PaymentMethod" ADD VALUE 'MIXED';

-- CreateTable
CREATE TABLE "public"."SalePaymentMethodEntry" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "saleId" BIGINT NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalePaymentMethodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccountReceivableDownPaymentMethodEntry" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "accountReceivableId" BIGINT NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountReceivableDownPaymentMethodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccountReceivablePaymentMethodEntry" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "paymentId" BIGINT NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountReceivablePaymentMethodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalePaymentMethodEntry_uuid_key" ON "public"."SalePaymentMethodEntry"("uuid");

-- CreateIndex
CREATE INDEX "SalePaymentMethodEntry_saleId_idx" ON "public"."SalePaymentMethodEntry"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountReceivableDownPaymentMethodEntry_uuid_key" ON "public"."AccountReceivableDownPaymentMethodEntry"("uuid");

-- CreateIndex
CREATE INDEX "AccountReceivableDownPaymentMethodEntry_accountReceivableId_idx" ON "public"."AccountReceivableDownPaymentMethodEntry"("accountReceivableId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountReceivablePaymentMethodEntry_uuid_key" ON "public"."AccountReceivablePaymentMethodEntry"("uuid");

-- CreateIndex
CREATE INDEX "AccountReceivablePaymentMethodEntry_paymentId_idx" ON "public"."AccountReceivablePaymentMethodEntry"("paymentId");

-- AddForeignKey
ALTER TABLE "public"."SalePaymentMethodEntry" ADD CONSTRAINT "SalePaymentMethodEntry_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountReceivableDownPaymentMethodEntry" ADD CONSTRAINT "AccountReceivableDownPaymentMethodEntry_accountReceivableI_fkey" FOREIGN KEY ("accountReceivableId") REFERENCES "public"."AccountReceivable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountReceivablePaymentMethodEntry" ADD CONSTRAINT "AccountReceivablePaymentMethodEntry_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."AccountReceivablePayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DataMigration: respalda los valores existentes de las columnas escalares de metodo de pago
-- en las nuevas tablas de desglose, antes de eliminar esas columnas.
INSERT INTO "public"."SalePaymentMethodEntry" ("uuid", "saleId", "method", "amount")
SELECT gen_random_uuid()::text, "id", "paymentMethod", "total"
FROM "public"."Sale"
WHERE "paymentMethod" IN ('CASH', 'TRANSFER');

INSERT INTO "public"."AccountReceivableDownPaymentMethodEntry" ("uuid", "accountReceivableId", "method", "amount")
SELECT gen_random_uuid()::text, "id", COALESCE("downPaymentMethod", 'CASH'), "downPayment"
FROM "public"."AccountReceivable"
WHERE "downPayment" > 0;

INSERT INTO "public"."AccountReceivablePaymentMethodEntry" ("uuid", "paymentId", "method", "amount")
SELECT gen_random_uuid()::text, "id", "paymentMethod", "amount"
FROM "public"."AccountReceivablePayment";

-- AlterTable
ALTER TABLE "public"."AccountReceivable" DROP COLUMN "downPaymentMethod";

-- AlterTable
ALTER TABLE "public"."AccountReceivablePayment" DROP COLUMN "paymentMethod";
