-- CreateTable
CREATE TABLE "public"."Quote" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "clientId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "currency" "public"."Currency" NOT NULL DEFAULT 'USD',
    "quoteDate" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),
    "observations" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "convertedSaleId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuoteDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "quoteId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "QuoteDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_uuid_key" ON "public"."Quote"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_number_key" ON "public"."Quote"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_convertedSaleId_key" ON "public"."Quote"("convertedSaleId");

-- CreateIndex
CREATE INDEX "Quote_clientId_idx" ON "public"."Quote"("clientId");

-- CreateIndex
CREATE INDEX "Quote_userId_idx" ON "public"."Quote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteDetail_uuid_key" ON "public"."QuoteDetail"("uuid");

-- CreateIndex
CREATE INDEX "QuoteDetail_quoteId_idx" ON "public"."QuoteDetail"("quoteId");

-- CreateIndex
CREATE INDEX "QuoteDetail_productId_idx" ON "public"."QuoteDetail"("productId");

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_convertedSaleId_fkey" FOREIGN KEY ("convertedSaleId") REFERENCES "public"."Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuoteDetail" ADD CONSTRAINT "QuoteDetail_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuoteDetail" ADD CONSTRAINT "QuoteDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
