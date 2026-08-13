-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "clientUuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_clientUuid_key" ON "Sale"("clientUuid");
