-- AlterTable
ALTER TABLE "public"."MarginProfile" ALTER COLUMN "percentage" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."PurchaseDetailPrice" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "purchaseDetailId" BIGINT NOT NULL,
    "marginProfileId" BIGINT NOT NULL,
    "price" DECIMAL(12,2),
    "priceCop" DECIMAL(14,2),

    CONSTRAINT "PurchaseDetailPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseDetailPrice_uuid_key" ON "public"."PurchaseDetailPrice"("uuid");

-- CreateIndex
CREATE INDEX "PurchaseDetailPrice_purchaseDetailId_idx" ON "public"."PurchaseDetailPrice"("purchaseDetailId");

-- CreateIndex
CREATE INDEX "PurchaseDetailPrice_marginProfileId_idx" ON "public"."PurchaseDetailPrice"("marginProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseDetailPrice_purchaseDetailId_marginProfileId_key" ON "public"."PurchaseDetailPrice"("purchaseDetailId", "marginProfileId");

-- AddForeignKey
ALTER TABLE "public"."PurchaseDetailPrice" ADD CONSTRAINT "PurchaseDetailPrice_purchaseDetailId_fkey" FOREIGN KEY ("purchaseDetailId") REFERENCES "public"."PurchaseDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchaseDetailPrice" ADD CONSTRAINT "PurchaseDetailPrice_marginProfileId_fkey" FOREIGN KEY ("marginProfileId") REFERENCES "public"."MarginProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

