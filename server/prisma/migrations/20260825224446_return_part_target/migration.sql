-- DropForeignKey
ALTER TABLE "public"."Return" DROP CONSTRAINT "Return_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Return" ADD COLUMN     "partId" BIGINT,
ALTER COLUMN "productId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."DamagedPart" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "partId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DamagedPart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DamagedPart_uuid_key" ON "public"."DamagedPart"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "DamagedPart_partId_key" ON "public"."DamagedPart"("partId");

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DamagedPart" ADD CONSTRAINT "DamagedPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
