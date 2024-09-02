import { Router } from "express";
import {
    verifyOtpController,
    sendOtpController,
} from "../controllers/auth";

const router = Router();

router.post('/verify-otp',verifyOtpController);
router.post('/send-otp', sendOtpController);

export default router;