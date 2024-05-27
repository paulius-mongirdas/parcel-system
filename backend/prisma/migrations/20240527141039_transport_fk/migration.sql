-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "transportId" INTEGER;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports"("id") ON DELETE SET NULL ON UPDATE CASCADE;
