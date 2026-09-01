-- CreateTable
CREATE TABLE "public"."WeeklyReport" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "pdf" BYTEA NOT NULL,
    "telegramSent" BOOLEAN NOT NULL DEFAULT false,
    "telegramError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReport_uuid_key" ON "public"."WeeklyReport"("uuid");

-- CreateIndex
CREATE INDEX "WeeklyReport_weekStart_idx" ON "public"."WeeklyReport"("weekStart");
