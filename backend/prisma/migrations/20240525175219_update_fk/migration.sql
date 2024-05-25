-- AlterTable
ALTER TABLE "transports" ADD COLUMN     "centerId" INTEGER;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
