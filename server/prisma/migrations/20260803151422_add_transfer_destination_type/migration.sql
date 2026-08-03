-- DropForeignKey
ALTER TABLE "public"."StockTransfer" DROP CONSTRAINT "StockTransfer_destStoreId_fkey";

-- AlterTable
ALTER TABLE "public"."StockTransfer" ADD COLUMN     "destType" "public"."TransferDestinationType" NOT NULL DEFAULT 'STORE',
ADD COLUMN     "destUserId" BIGINT,
ALTER COLUMN "destStoreId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "StockTransfer_destUserId_idx" ON "public"."StockTransfer"("destUserId");

-- AddForeignKey
ALTER TABLE "public"."StockTransfer" ADD CONSTRAINT "StockTransfer_destStoreId_fkey" FOREIGN KEY ("destStoreId") REFERENCES "public"."Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockTransfer" ADD CONSTRAINT "StockTransfer_destUserId_fkey" FOREIGN KEY ("destUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
