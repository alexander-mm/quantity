-- CreateTable
CREATE TABLE "public"."Sale" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "reference" TEXT,
    "clientId" BIGINT NOT NULL,
    "storeId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "status" "public"."DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "saleDate" TIMESTAMP(3) NOT NULL,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SaleDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "saleId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "SaleDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sale_uuid_key" ON "public"."Sale"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_number_key" ON "public"."Sale"("number");

-- CreateIndex
CREATE UNIQUE INDEX "SaleDetail_uuid_key" ON "public"."SaleDetail"("uuid");

-- CreateIndex
CREATE INDEX "SaleDetail_saleId_idx" ON "public"."SaleDetail"("saleId");

-- CreateIndex
CREATE INDEX "SaleDetail_productId_idx" ON "public"."SaleDetail"("productId");

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleDetail" ADD CONSTRAINT "SaleDetail_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleDetail" ADD CONSTRAINT "SaleDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
