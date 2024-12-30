import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Fetch all seats and return the availability status
export const getAllSeats = async (req, res) => {
  try {
    const seats = await prisma.seat.findMany({
      orderBy: { row: "asc" },
    });

    const availableSeats = seats.filter((seat) => !seat.isBooked).length;

    res.status(200).json({
      totalSeats: seats.length,
      availableSeats,
      seats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seat data', error });
  }
};

// Reserve seats
export const reserveSeats = async (req, res) => {
  const { numberOfSeats } = req.body;
  const userId = req.user.id;

  if (numberOfSeats > 7) {
    return res.status(400).json({ message: "Cannot reserve more than 7 seats at a time." });
  }

  try {
    // Fetch available seats, ordered by row and seatNumber
    const availableSeats = await prisma.seat.findMany({
      where: { isBooked: false },
      orderBy: [{ row: "asc" }, { seatNumber: "asc" }], // Order seats sequentially
    });

    if (availableSeats.length < numberOfSeats) {
      return res.status(400).json({
        message: `Only ${availableSeats.length} seats are available. Please adjust your booking.`,
      });
    }

    // Group seats by row
    const groupedSeats = availableSeats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});

    let reservedSeats = [];
    // Try to find all seats in the same row
    for (const row in groupedSeats) {
      if (groupedSeats[row].length >= numberOfSeats) {
        reservedSeats = groupedSeats[row].slice(0, numberOfSeats);
        break;
      }
    }

    // If not enough seats are available in a single row, pick sequentially
    if (reservedSeats.length === 0) {
      reservedSeats = availableSeats.slice(0, numberOfSeats);
    }

    // Collect seat IDs for reservation
    const seatIds = reservedSeats.map((seat) => seat.id);

    // Perform reservation in a transaction
    await prisma.$transaction([
      prisma.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { isBooked: true, bookedBy: userId },
      }),
      prisma.booking.create({
        data: {
          userId,
          seatIds: seatIds.join(","), // Store seat IDs in the booking record
        },
      }),
    ]);

    res.status(200).json({
      message: "Seats reserved successfully",
      reservedSeats: reservedSeats.map((seat) => ({
        id: seat.id,
        row: seat.row,
        seatNumber: seat.seatNumber,
      })),
    });
  } catch (error) {
    console.error("Error during seat reservation:", error);
    res.status(500).json({ message: "Error reserving seats", error });
  }
};


export const resetBooking = async (req, res) => {
  try {
    await prisma.seat.updateMany({ data: { isBooked: false, bookedBy: null } });
    await prisma.booking.deleteMany({});
    res.status(200).json({ message: "All bookings have been reset." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting bookings", error });
  }
};
