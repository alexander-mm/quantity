-- CreateTable
CREATE TABLE "public"."AttendanceDevice" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "storeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "lastIp" TEXT,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,

    CONSTRAINT "AttendanceDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceDevice_uuid_key" ON "public"."AttendanceDevice"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceDevice_tokenHash_key" ON "public"."AttendanceDevice"("tokenHash");

-- CreateIndex
CREATE INDEX "AttendanceDevice_storeId_idx" ON "public"."AttendanceDevice"("storeId");

-- AddForeignKey
ALTER TABLE "public"."AttendanceDevice" ADD CONSTRAINT "AttendanceDevice_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
