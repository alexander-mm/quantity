-- AlterTable
ALTER TABLE "Return" ADD COLUMN     "clientUuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Return_clientUuid_key" ON "Return"("clientUuid");
