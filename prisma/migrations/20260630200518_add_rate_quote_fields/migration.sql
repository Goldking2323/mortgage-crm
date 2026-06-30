-- CreateEnum
CREATE TYPE "RateType" AS ENUM ('FIXED', 'VARIABLE', 'ADJUSTABLE');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "quotedRate" DOUBLE PRECISION,
ADD COLUMN     "rateType" "RateType",
ADD COLUMN     "term" INTEGER;
