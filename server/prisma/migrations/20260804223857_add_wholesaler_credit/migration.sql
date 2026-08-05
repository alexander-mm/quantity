-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "currency" "public"."Currency",
ADD COLUMN     "isWholesaler" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usesCredit" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."AccountReceivable" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "clientId" BIGINT NOT NULL,
    "saleId" BIGINT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountReceivable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountReceivable_uuid_key" ON "public"."AccountReceivable"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "AccountReceivable_number_key" ON "public"."AccountReceivable"("number");

-- CreateIndex
CREATE UNIQUE INDEX "AccountReceivable_saleId_key" ON "public"."AccountReceivable"("saleId");

-- CreateIndex
CREATE INDEX "AccountReceivable_clientId_idx" ON "public"."AccountReceivable"("clientId");

-- CreateIndex
CREATE INDEX "AccountReceivable_isPaid_idx" ON "public"."AccountReceivable"("isPaid");

-- CreateIndex
CREATE INDEX "Client_isWholesaler_idx" ON "public"."Client"("isWholesaler");

-- AddForeignKey
ALTER TABLE "public"."AccountReceivable" ADD CONSTRAINT "AccountReceivable_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountReceivable" ADD CONSTRAINT "AccountReceivable_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
