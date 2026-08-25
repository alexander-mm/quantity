-- AlterEnum
ALTER TYPE "public"."ReturnReason" ADD VALUE 'FACTORY_DEFECT';

-- CreateTable
CREATE TABLE "public"."DamagedStock" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "productId" BIGINT NOT NULL,
    "storeId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DamagedStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DamagedStock_uuid_key" ON "public"."DamagedStock"("uuid");

-- CreateIndex
CREATE INDEX "DamagedStock_productId_idx" ON "public"."DamagedStock"("productId");

-- CreateIndex
CREATE INDEX "DamagedStock_storeId_idx" ON "public"."DamagedStock"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "DamagedStock_productId_storeId_key" ON "public"."DamagedStock"("productId", "storeId");

-- AddForeignKey
ALTER TABLE "public"."DamagedStock" ADD CONSTRAINT "DamagedStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DamagedStock" ADD CONSTRAINT "DamagedStock_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
