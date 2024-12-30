/*
  Warnings:

  - The `bookedBy` column on the `Seat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_bookedBy_fkey";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "bookedBy",
ADD COLUMN     "bookedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
