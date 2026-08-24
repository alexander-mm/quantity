-- CreateTable
CREATE TABLE "public"."AccountReceivablePayment" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "accountReceivableId" BIGINT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,

    CONSTRAINT "AccountReceivablePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccountReceivablePaymentVoucher" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "paymentId" BIGINT NOT NULL,
    "number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountReceivablePaymentVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountReceivablePayment_uuid_key" ON "public"."AccountReceivablePayment"("uuid");

-- CreateIndex
CREATE INDEX "AccountReceivablePayment_accountReceivableId_idx" ON "public"."AccountReceivablePayment"("accountReceivableId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountReceivablePaymentVoucher_uuid_key" ON "public"."AccountReceivablePaymentVoucher"("uuid");

-- CreateIndex
CREATE INDEX "AccountReceivablePaymentVoucher_paymentId_idx" ON "public"."AccountReceivablePaymentVoucher"("paymentId");

-- AddForeignKey
ALTER TABLE "public"."AccountReceivablePayment" ADD CONSTRAINT "AccountReceivablePayment_accountReceivableId_fkey" FOREIGN KEY ("accountReceivableId") REFERENCES "public"."AccountReceivable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccountReceivablePaymentVoucher" ADD CONSTRAINT "AccountReceivablePaymentVoucher_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."AccountReceivablePayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
