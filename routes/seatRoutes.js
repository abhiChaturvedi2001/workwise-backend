import express from "express"
import { getAllSeats, reserveSeats, resetBooking } from "../controller/seatController.js";
const router = express.Router();

router.post('/reserve', reserveSeats);
router.post('/reset', resetBooking);
router.get('/', getAllSeats);

export default router;
