import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import userRoutes from "./routes/userRoutes.js"
import seatRoutes from "./routes/seatRoutes.js"
dotenv.config({})

const app = express();
const options = {
    origin: "https://workwise-omega.vercel.app",
    credentials: true
}
app.use(express.json());
app.use(cors(options));
app.use(cookieParser());
app.use("/auth/v0", userRoutes)
app.use('/seats', seatRoutes);


const initializeSeats = async () => {
    try {
        // Clear existing seats
        await prisma.seat.deleteMany({});
        console.log('Cleared existing seats');

        const seats = [];
        for (let i = 1; i <= 11; i++) {
            const seatsInRow = i === 11 ? 3 : 7; // Last row has 3 seats
            for (let j = 1; j <= seatsInRow; j++) {
                seats.push({ seatNumber: (i - 1) * 7 + j, row: i });
            }
        }

        await prisma.seat.createMany({
            data: seats,
        });

        console.log('Seats initialized', seats.length);
    } catch (error) {
        console.error('Error initializing seats:', error.message);
    } finally {
        await prisma.$disconnect();
    }
};
initializeSeats();

const port = process.env.PORT || 4060

app.listen(port, () => {
    console.log(`server is listening on ${port}`)
})