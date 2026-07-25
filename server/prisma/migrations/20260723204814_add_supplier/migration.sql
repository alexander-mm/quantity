-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "companyName" VARCHAR(150) NOT NULL,
    "contactName" VARCHAR(150),
    "taxId" VARCHAR(20),
    "phone" VARCHAR(20),
    "email" VARCHAR(150),
    "address" VARCHAR(250),
    "city" VARCHAR(100),
    "observations" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_uuid_key" ON "public"."Supplier"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "public"."Supplier"("code");
