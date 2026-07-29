-- CreateEnum
CREATE TYPE "public"."TransferStatus" AS ENUM ('PENDING', 'RECEIVED', 'WITH_ISSUES', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."StockTransfer" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "originStoreId" BIGINT NOT NULL,
    "destStoreId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "status" "public"."TransferStatus" NOT NULL DEFAULT 'PENDING',
    "dispatchDate" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "receivedBy" BIGINT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "StockTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StockTransferDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "transferId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "quantitySent" DECIMAL(12,2) NOT NULL,
    "quantityReceived" DECIMAL(12,2),

    CONSTRAINT "StockTransferDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockTransfer_uuid_key" ON "public"."StockTransfer"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "StockTransfer_number_key" ON "public"."StockTransfer"("number");

-- CreateIndex
CREATE INDEX "StockTransfer_status_idx" ON "public"."StockTransfer"("status");

-- CreateIndex
CREATE INDEX "StockTransfer_destStoreId_idx" ON "public"."StockTransfer"("destStoreId");

-- CreateIndex
CREATE INDEX "StockTransfer_originStoreId_idx" ON "public"."StockTransfer"("originStoreId");

-- CreateIndex
CREATE UNIQUE INDEX "StockTransferDetail_uuid_key" ON "public"."StockTransferDetail"("uuid");

-- CreateIndex
CREATE INDEX "StockTransferDetail_transferId_idx" ON "public"."StockTransferDetail"("transferId");

-- CreateIndex
CREATE INDEX "StockTransferDetail_productId_idx" ON "public"."StockTransferDetail"("productId");

-- AddForeignKey
ALTER TABLE "public"."StockTransfer" ADD CONSTRAINT "StockTransfer_originStoreId_fkey" FOREIGN KEY ("originStoreId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockTransfer" ADD CONSTRAINT "StockTransfer_destStoreId_fkey" FOREIGN KEY ("destStoreId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockTransfer" ADD CONSTRAINT "StockTransfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockTransferDetail" ADD CONSTRAINT "StockTransferDetail_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "public"."StockTransfer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockTransferDetail" ADD CONSTRAINT "StockTransferDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
