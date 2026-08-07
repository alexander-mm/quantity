-- DropForeignKey
ALTER TABLE "public"."PurchaseDetailPrice" DROP CONSTRAINT "PurchaseDetailPrice_marginProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseDetailPrice" DROP CONSTRAINT "PurchaseDetailPrice_purchaseDetailId_fkey";

-- AlterTable
ALTER TABLE "public"."MarginProfile" ALTER COLUMN "percentage" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductPrice" DROP COLUMN "isManual",
ALTER COLUMN "price" SET NOT NULL;

-- DropTable
DROP TABLE "public"."PurchaseDetailPrice";

-- CreateTable
CREATE TABLE "public"."ProductPriceEntry" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "productId" BIGINT NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "price" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPriceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PurchaseDetailPriceEntry" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "purchaseDetailId" BIGINT NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "price" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "PurchaseDetailPriceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductPriceEntry_uuid_key" ON "public"."ProductPriceEntry"("uuid");

-- CreateIndex
CREATE INDEX "ProductPriceEntry_productId_idx" ON "public"."ProductPriceEntry"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPriceEntry_productId_currency_sequence_key" ON "public"."ProductPriceEntry"("productId", "currency", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseDetailPriceEntry_uuid_key" ON "public"."PurchaseDetailPriceEntry"("uuid");

-- CreateIndex
CREATE INDEX "PurchaseDetailPriceEntry_purchaseDetailId_idx" ON "public"."PurchaseDetailPriceEntry"("purchaseDetailId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseDetailPriceEntry_purchaseDetailId_currency_sequence_key" ON "public"."PurchaseDetailPriceEntry"("purchaseDetailId", "currency", "sequence");

-- AddForeignKey
ALTER TABLE "public"."ProductPriceEntry" ADD CONSTRAINT "ProductPriceEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchaseDetailPriceEntry" ADD CONSTRAINT "PurchaseDetailPriceEntry_purchaseDetailId_fkey" FOREIGN KEY ("purchaseDetailId") REFERENCES "public"."PurchaseDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

