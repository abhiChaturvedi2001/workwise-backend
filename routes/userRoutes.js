import express from "express"
import { GetProfile, Login, Logout, Register } from "../controller/authController.js";
import { authValidation } from "../middleware/authMiddlware.js";
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/profile", authValidation, GetProfile);

export default router;