-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('USD', 'COP');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "pvpCop" DECIMAL(14,2);

-- AlterTable
ALTER TABLE "public"."ProductPrice" ADD COLUMN     "priceCop" DECIMAL(14,2);

-- AlterTable
ALTER TABLE "public"."Sale" ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'USD';
