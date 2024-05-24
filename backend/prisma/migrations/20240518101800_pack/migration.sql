/*
  Warnings:

  - The `status` column on the `packages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'IN_DELIVERY', 'DELIVERED', 'CANCELED', 'NOT_DELIVERED');

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'CREATED';
