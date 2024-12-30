import express from "express"
import { getAllSeats, reserveSeats, resetBooking } from "../controller/seatController.js";
import { authValidation } from "../middleware/authMiddlware.js";
const router = express.Router();

router.post('/reserve', authValidation, reserveSeats);
router.post('/reset', resetBooking);
router.get('/', authValidation, getAllSeats);

export default router;
