-- AlterTable
ALTER TABLE "public"."Store" ADD COLUMN     "attendanceIp" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "attendancePin" TEXT;

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "storeId" BIGINT NOT NULL,
    "clockIn" TIMESTAMP(3) NOT NULL,
    "clockOut" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_uuid_key" ON "public"."Attendance"("uuid");

-- CreateIndex
CREATE INDEX "Attendance_userId_idx" ON "public"."Attendance"("userId");

-- CreateIndex
CREATE INDEX "Attendance_storeId_idx" ON "public"."Attendance"("storeId");

-- CreateIndex
CREATE INDEX "Attendance_clockIn_idx" ON "public"."Attendance"("clockIn");

-- CreateIndex
CREATE INDEX "Store_attendanceIp_idx" ON "public"."Store"("attendanceIp");

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
