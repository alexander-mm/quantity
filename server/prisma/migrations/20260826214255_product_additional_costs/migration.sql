-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "baseCostPrice" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- Datos existentes: sin costos adicionales todavía, así que el costo base es
-- exactamente el costo total que ya tenían.
UPDATE "public"."Product" SET "baseCostPrice" = "costPrice";

-- CreateTable
CREATE TABLE "public"."ProductAdditionalCost" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "productId" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAdditionalCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductAdditionalCost_uuid_key" ON "public"."ProductAdditionalCost"("uuid");

-- CreateIndex
CREATE INDEX "ProductAdditionalCost_productId_idx" ON "public"."ProductAdditionalCost"("productId");

-- AddForeignKey
ALTER TABLE "public"."ProductAdditionalCost" ADD CONSTRAINT "ProductAdditionalCost_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
