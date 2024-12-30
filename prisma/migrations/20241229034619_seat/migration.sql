/*
  Warnings:

  - You are about to drop the column `column` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Seat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seatNumber]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatNumber` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "column",
DROP COLUMN "createdAt",
ADD COLUMN     "bookedBy" INTEGER,
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seatNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_seatNumber_key" ON "Seat"("seatNumber");
