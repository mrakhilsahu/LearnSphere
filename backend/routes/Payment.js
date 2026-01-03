import express from "express";
import { auth } from "../middlewares/authmiddleware.js";
import {
  capturePayment,
  razorpayWebhook,
} from "../controllers/Payment.js";

const router = express.Router();

// student initiates payment
router.post("/capture", auth, capturePayment);

// razorpay webhook (no auth)
router.post("/webhook", razorpayWebhook);

export default router;
