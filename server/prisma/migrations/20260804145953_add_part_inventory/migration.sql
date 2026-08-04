-- CreateEnum
CREATE TYPE "public"."PartMovementType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "public"."Part" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartMovement" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" "public"."PartMovementType" NOT NULL,
    "userId" BIGINT NOT NULL,
    "movementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartMovementDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "movementId" BIGINT NOT NULL,
    "partId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "PartMovementDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Part_uuid_key" ON "public"."Part"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Part_code_key" ON "public"."Part"("code");

-- CreateIndex
CREATE INDEX "Part_isActive_idx" ON "public"."Part"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PartMovement_uuid_key" ON "public"."PartMovement"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PartMovement_number_key" ON "public"."PartMovement"("number");

-- CreateIndex
CREATE INDEX "PartMovement_type_idx" ON "public"."PartMovement"("type");

-- CreateIndex
CREATE INDEX "PartMovement_userId_idx" ON "public"."PartMovement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PartMovementDetail_uuid_key" ON "public"."PartMovementDetail"("uuid");

-- CreateIndex
CREATE INDEX "PartMovementDetail_movementId_idx" ON "public"."PartMovementDetail"("movementId");

-- CreateIndex
CREATE INDEX "PartMovementDetail_partId_idx" ON "public"."PartMovementDetail"("partId");

-- AddForeignKey
ALTER TABLE "public"."PartMovement" ADD CONSTRAINT "PartMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartMovementDetail" ADD CONSTRAINT "PartMovementDetail_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "public"."PartMovement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartMovementDetail" ADD CONSTRAINT "PartMovementDetail_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
