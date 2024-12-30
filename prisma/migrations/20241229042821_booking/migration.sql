-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_userId_fkey";

-- AlterTable
ALTER TABLE "Seat" ALTER COLUMN "bookedBy" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "seatIds" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_bookedBy_fkey" FOREIGN KEY ("bookedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
