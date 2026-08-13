-- CreateEnum
CREATE TYPE "public"."ReturnReason" AS ENUM ('DAMAGED', 'CUSTOMER_CHANGED_MIND', 'WRONG_ITEM', 'INCOMPATIBLE', 'WARRANTY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ReturnStatus" AS ENUM ('PENDING_REVIEW', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."ReturnDisposition" AS ENUM ('RESTOCK', 'DAMAGED');

-- CreateTable
CREATE TABLE "public"."Return" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "saleId" BIGINT,
    "saleDetailId" BIGINT,
    "productId" BIGINT NOT NULL,
    "storeId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "reason" "public"."ReturnReason" NOT NULL,
    "notes" TEXT,
    "status" "public"."ReturnStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "disposition" "public"."ReturnDisposition",
    "returnDate" TIMESTAMP(3) NOT NULL,
    "userId" BIGINT NOT NULL,
    "resolvedBy" BIGINT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Return_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Return_uuid_key" ON "public"."Return"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Return_number_key" ON "public"."Return"("number");

-- CreateIndex
CREATE INDEX "Return_status_idx" ON "public"."Return"("status");

-- CreateIndex
CREATE INDEX "Return_saleId_idx" ON "public"."Return"("saleId");

-- CreateIndex
CREATE INDEX "Return_productId_idx" ON "public"."Return"("productId");

-- CreateIndex
CREATE INDEX "Return_storeId_idx" ON "public"."Return"("storeId");

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_saleDetailId_fkey" FOREIGN KEY ("saleDetailId") REFERENCES "public"."SaleDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
