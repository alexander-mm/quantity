-- CreateTable
CREATE TABLE "public"."PartCategory" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "PartCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartCategory_uuid_key" ON "public"."PartCategory"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PartCategory_name_key" ON "public"."PartCategory"("name");

-- CreateIndex
CREATE INDEX "PartCategory_isActive_idx" ON "public"."PartCategory"("isActive");

-- AlterTable
ALTER TABLE "public"."Part" ADD COLUMN "categoryId" BIGINT;

-- CreateIndex
CREATE INDEX "Part_categoryId_idx" ON "public"."Part"("categoryId");

-- AddForeignKey
ALTER TABLE "public"."Part" ADD CONSTRAINT "Part_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."PartCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
